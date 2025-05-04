
const coordinateCache = new Map();
import { OPENWEATHER_API_KEY, NEWS_API_KEY, GEO_DB_API_KEY } from '@env';
const API_CALL_DELAY = 1000; 
const GEO_DB_HOST = 'wft-geo-db.p.rapidapi.com';


const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * 2 ** (attempt - 1)));
    }
  }
};

const normalizeText = (text) => {
  if (!text) return '';

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') 
    .replace(/\b(the|a|an|in|on|at|for|of|and|or)\b/g, '') 
    .replace(/\s+/g, ' ') 
    .trim();
};




const areSimilar = (a, b) => {
  const textA = normalizeText(a);
  const textB = normalizeText(b);

  if (textA.length < 10 || textB.length < 10) return false;
  if (textA.includes(textB) || textB.includes(textA)) return true;

  const tokensA = textA.split(' ').filter(t => t.length > 3);
  const tokensB = textB.split(' ').filter(t => t.length > 3);
  const intersection = tokensA.filter(token => tokensB.includes(token));
  const similarity = intersection.length / Math.max(tokensA.length, tokensB.length);

  return similarity >= 0.5;
};


const getCoordsFromCity = async (cityName) => {
  if (coordinateCache.has(cityName)) {
    return coordinateCache.get(cityName);
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  try {
    const data = await fetchWithRetry(url);
    if (!data.length) return null;
    
    const result = {
      name: data[0].name,
      lat: data[0].lat,
      lon: data[0].lon,
      country: data[0].country
    };
    
    coordinateCache.set(cityName, result);
    return result;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export const getNearbyCities = async (cityName) => {
  try {
    const coords = await getCoordsFromCity(cityName);
    if (!coords) return [`Please enter a valid city name`];

    const { lat, lon, name: mainCityName } = coords;
    const nearbyUrl = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${OPENWEATHER_API_KEY}`;
    const nearbyData = await fetchWithRetry(nearbyUrl);

    const acceptedCities = new Set([mainCityName]);
    const normalizedCities = new Set([normalizeText(mainCityName)]);

    if (nearbyData?.list) {
      nearbyData.list.forEach(entry => {
        const city = entry.name.trim();
        const norm = normalizeText(city);
        
        if (!/[^a-zA-Z\s]/.test(city)) {
          let isDuplicate = false;
          for (const existing of normalizedCities) {
            if (areSimilar(existing, norm) || existing.includes(norm) || norm.includes(existing)) {
              isDuplicate = true;
              break;
            }
          }
          
          if (!isDuplicate) {
            acceptedCities.add(city);
            normalizedCities.add(norm);
          }
        }
      });
    }

    return Array.from(acceptedCities);
  } catch (error) {
    console.error('Failed to fetch nearby cities:', error);
    return [`Please enter a valid city name`];
  }
};

export const fetchGlobalDisasters = async () => {
  try {
    const [reddit, fema] = await Promise.all([
      fetchRedditData(),
      fetchFemaData(),
    ]);

    const globalNews = await fetchNewsData('disaster OR earthquake OR flood OR wildfire OR hurricane');

    const allReports = [...globalNews, ...reddit, ...fema];
    const uniqueReports = removeDuplicates(allReports);

    return {
      timestamp: new Date().toISOString(),
      global: true,
      allReports: uniqueReports.sort((a, b) => new Date(b.date) - new Date(a.date)),
    };
  } catch (error) {  
    console.error('Error in fetchGlobalDisasters:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    return {
      timestamp: new Date().toISOString(),
      global: true,
      allReports: [],
      error: error.message
    };
  }
};




export const getCityNameFromCoords = async (lat, lon) => {
  try {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${OPENWEATHER_API_KEY}`;
    const data = await fetchWithRetry(url);
    
    if (!data || !data.length) return null;

    
    const cityCandidate = data.find(loc => loc.population && loc.name);
    return cityCandidate?.name || data[0]?.name || null;
  } catch (error) {
    console.error('Error fetching city name from coordinates (OpenWeather):', error);
    return null;
  }
};



const removeDuplicates = (items) => {
  const unique = [];
  const titles = new Set();
  const urls = new Set();
  
  items.forEach(item => {
    const normalizedTitle = normalizeText(item.title);
    const itemUrl = item.url || '';
    
    if (!titles.has(normalizedTitle) && !urls.has(itemUrl)) {
      titles.add(normalizedTitle);
      urls.add(itemUrl);
      unique.push(item);
    }
  });
  
  return unique;
};

const mentionsLocation = (text, locations) => {
  if (!text) return false;
  const textLower = text.toLowerCase();
  return locations.some(loc => textLower.includes(loc.toLowerCase()));
};

const fetchWeatherData = async (location) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const data = await fetchWithRetry(url);
    const severeConditions = ['Thunderstorm', 'Tornado', 'Hurricane', 'Extreme', 'Blizzard', 'Heavy Rain', 'Heavy Snow', 'Hail', 'Freezing Rain'];
    const isSevere = data.weather.some(w => severeConditions.some(sc => w.main.includes(sc)));
    return {
      source: 'weather',
      title: `${data.weather[0].main} in ${data.name}`,
      description: `${data.weather[0].description}. Temp: ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)`,
      location: data.name,
      coordinates: { lat: data.coord.lat, lon: data.coord.lon },
      date: new Date().toISOString(),
      isSevere,
      severity: isSevere ? 'high' : 'low'
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const fetchRedditData = async (keywords = 'disaster OR earthquake OR flood OR wildfire OR hurricane') => {
  const url = `https://www.reddit.com/r/news/search.json?q=${encodeURIComponent(keywords)}&restrict_sr=true&sort=new&limit=15`;
  try {
    const data = await fetchWithRetry(url);
    return data.data.children.map(post => ({
      source: 'reddit',
      title: post.data.title,
      description: post.data.selftext || post.data.url,
      url: `https://reddit.com${post.data.permalink}`,
      date: new Date(post.data.created_utc * 1000).toISOString(),
      upvotes: post.data.ups,
      comments: post.data.num_comments
    })).filter(post => post.title.length > 10);
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return [];
  }
};

const fetchFemaData = async () => {
  const url = 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries';
  try {
    const data = await fetchWithRetry(url);
    const oneMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    return data.DisasterDeclarationsSummaries
      .filter(d => new Date(d.declarationDate) > new Date(oneMonthAgo))
      .map(d => ({
        source: 'fema',
        title: `${d.incidentType} in ${d.state}`,
        description: d.declarationTitle,
        location: `${d.state}, ${d.designatedArea}`,
        date: new Date(d.declarationDate).toISOString(),
        severity: ['Fire', 'Tornado', 'Hurricane'].includes(d.incidentType) ? 'high' : 
                 ['Flood', 'Earthquake'].includes(d.incidentType) ? 'medium' : 'low',
        coordinates: null // Will be populated later
      }));
  } catch (error) {
    console.error('Error fetching FEMA:', error);
    return [];
  }
};

const fetchNewsData = async (cityName = 'disaster OR earthquake OR flood OR wildfire OR hurricane') => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const query = `${cityName} AND (disaster OR flood OR wildfire OR storm OR earthquake)`;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${weekAgo}&to=${today}&sortBy=relevancy&apiKey=${NEWS_API_KEY}`;
  try {
    const data = await fetchWithRetry(url);
    return data.articles.map(article => ({
      source: 'newsapi',
      title: article.title,
      description: article.description || article.content?.substring(0, 200) || '',
      url: article.url,
      date: new Date(article.publishedAt).toISOString(),
      author: article.source.name,
      imageUrl: article.urlToImage
    })).filter(article => article.title.length > 10);
  } catch (error) {
    console.error(`Error fetching NewsAPI data for ${cityName}:`, error);
    return [];
  }
};


export const fetchLocationDisasters = async (location) => {
  try {
    const result = await fetchAllData(location);
    
    
    const reportsWithDistance = result.genuineReports.map(report => {
      if (report.coordinates) {
        return {
          ...report,
          distance: getDistance(
            { latitude: result.searchedLocation.coords?.lat || 0, longitude: result.searchedLocation.coords?.lon || 0 },
            report.coordinates
          )
        };
      }
      return report;
    });

    return {
      ...result,
      genuineReports: reportsWithDistance
    };
  } catch (error) {
    console.error('Error in fetchLocationDisasters:', error);
    return {
      timestamp: new Date().toISOString(),
      searchedLocation: location,
      nearbyCities: [location],
      allReports: [],
      genuineReports: []
    };
  }
};

const fetchAllData = async (location) => {
  try {
    const cities = await getNearbyCities(location); 
    const normalizedCities = cities.map(c => c.toLowerCase());

    
    const [reddit, fema, weather] = await Promise.all([
      fetchRedditData(),
      fetchFemaData(),
      fetchWeatherData(location),
    ]);

    
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const fetchData = async (cityName = '') => {
      try {
        const results = [];
    
        
        const cityInfo = await getCityInfo(cityName);
        if (!cityInfo) return [];
    
        const { lat, lon } = cityInfo;
    
        
        const weatherData = await fetchWeatherData(cityName);
    
        
        const cities = await getNearbyCities(lat, lon);
    
        
        const [newsData, redditData, femaData] = await Promise.all([
          fetchNewsData(cityName), 
          fetchRedditData(),       
          fetchFemaData()         
        ]);
    
       
        const allRaw = [...newsData, ...redditData, ...femaData];
    
        
        const deduped = [];
        for (const item of allRaw) {
          const content = item.title || item.description || '';
          const matchCity = cities.find(c =>
            content.toLowerCase().includes(c.toLowerCase())
          );
    
          const isDuplicate = deduped.some(existing =>
            calculateSimilarity(normalizeText(existing.title || ''), normalizeText(content)) > 0.8
          );
    
          if (!isDuplicate && matchCity) {
            deduped.push({
              ...item,
              matchedLocation: matchCity,
            });
          }
        }
    
        
        if (weatherData?.alert && weatherData.alert !== 'No Alert') {
          deduped.unshift({
            title: weatherData.alert,
            source: 'Weather',
            location: cityName,
            matchedLocation: cityName,
            description: '',
            severity: 'medium',
          });
        }
    
        return deduped;
      } catch (err) {
        console.error('fetchData failed:', err);
        return [];
      }
    };
    const cityNewsResults = [];
for (const city of cities) {
  try {
    const news = await fetchNewsData(city);
    cityNewsResults.push(news);
    if (cities.indexOf(city) < cities.length - 1) {
      await new Promise(resolve => setTimeout(resolve, API_CALL_DELAY));
    }
  } catch (e) {
    console.warn(`Skipping ${city} due to error:`, e.message);
  }
}

    const allCityNews = cityNewsResults.flat();

    let allReports = [...allCityNews, ...reddit, ...fema];
    if (weather) allReports.push(weather);

    const genuineReports = [];
    const seenTitles = new Set();

    allReports.forEach(report => {
      const content = `${report.title} ${report.description}`;
      if (mentionsLocation(content, normalizedCities) && !seenTitles.has(normalizeText(report.title))) {
        seenTitles.add(normalizeText(report.title));
        genuineReports.push({
          ...report,
          isLocationRelevant: true,
          matchedLocation: cities.find(c => content.toLowerCase().includes(c.toLowerCase())) || location
        });
      }
    });

    for (let i = 0; i < allReports.length; i++) {
      if (seenTitles.has(normalizeText(allReports[i].title))) continue;
      for (let j = 0; j < genuineReports.length; j++) {
        if (areSimilar(allReports[i].title, genuineReports[j].title)) {
          genuineReports.push({
            ...allReports[i],
            isLocationRelevant: false,
            matchedLocation: location
          });
          seenTitles.add(normalizeText(allReports[i].title));
          break;
        }
      }
    }

    const uniqueGenuineReports = removeDuplicates(genuineReports);

    return {
      timestamp: new Date().toISOString(),
      searchedLocation: location,
      nearbyCities: cities,
      allReports,
      genuineReports: uniqueGenuineReports.sort((a, b) => {
        if (a.isLocationRelevant !== b.isLocationRelevant) {
          return b.isLocationRelevant - a.isLocationRelevant;
        }
        return new Date(b.date) - new Date(a.date);
      })
    };
  } catch (error) {
    console.error('Error in fetchAllData:', error);
    return {
      timestamp: new Date().toISOString(),
      searchedLocation: location,
      nearbyCities: [location],
      allReports: [],
      genuineReports: []
    };
  }
};


export default fetchAllData;
