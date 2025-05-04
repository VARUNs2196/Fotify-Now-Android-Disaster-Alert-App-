import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Linking,
  ScrollView,
} from 'react-native';
import fetchData from '../services/dataService';
import Navbar from '../components/navbar';

const AlertScreen = ({ route }) => {
    const { filter } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [selectedSource, setSelectedSource] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('New York');
        if (!result) throw new Error('Failed to fetch data');
  
        const reports = result.allReports || [];
  
        const newsData = reports.filter((r) => r.source === 'newsapi');
        const redditData = reports.filter((r) => r.source === 'reddit');
        const femaData = reports.filter((r) => r.source === 'fema');
  
        const combinedAlerts = [
          ...newsData.map((article) => ({
            type: 'News Alert',
            message: article.title,
            url: article.url,
            source: 'news',
            description: article.description,
            content: article.content,
          })),
          ...redditData.map((post) => ({
            type: 'Reddit Alert',
            message: post.title,
            url: post.url,
            source: 'reddit',
            description: post.description,
          })),
          ...femaData.map((alert) => ({
            type: 'FEMA Alert',
            message: `${alert.title} (${alert.description}) in ${alert.location}`,
            source: 'fema',
          })),
        ];
  
  
       
        setAlerts(combinedAlerts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(true);
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  
  useEffect(() => {
    console.log("Modal Visibility:", modalVisible);
  }, [modalVisible]);

  const filteredAlerts =
    selectedSource === 'all' ? alerts : alerts.filter((alert) => alert.source === selectedSource);

  const handleAlertPress = (alert) => {
    console.log("Alert pressed:", alert);
    setSelectedAlert(alert);
    setModalVisible(true);
    fadeIn();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    setModalVisible(false); 
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Navbar onSourceSelect={setSelectedSource} />
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading disaster alerts...</Text>
        </>
      ) : error ? (
        <Text style={styles.error}>Failed to load disaster alerts. Please try again later.</Text>
      ) : filteredAlerts.length === 0 ? (
        <Text style={styles.noAlerts}>No disaster alerts found at this time.</Text>
      ) : (
        <FlatList
          data={filteredAlerts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.alertItem} onPress={() => handleAlertPress(item)}>
              <Text style={styles.alertType}>{item.type}</Text>
              <Text style={styles.alertMessage}>{item.message}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {modalVisible && selectedAlert && (
        <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={fadeOut}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <ScrollView>
                <Text style={styles.modalHeading}>Title:</Text>
                <Text style={styles.modalTitle}>{selectedAlert?.message}</Text>
                <Text style={styles.modalHeading}>Description:</Text>
                <Text style={styles.modalDescription}>{selectedAlert?.description || 'No additional details available.'}</Text>
                <Text style={styles.modalHeading}>Content:</Text>
                <Text style={styles.modalContentText}>{selectedAlert?.content || 'No additional content available.'}</Text>
                {selectedAlert?.url && (
                  <TouchableOpacity style={styles.modalButton} onPress={() => Linking.openURL(selectedAlert.url)}>
                    <Text style={styles.modalButtonText}>Read More</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={fadeOut}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    marginTop:10
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noAlerts: {
    fontSize: 18,
    marginTop: "90%",
    color: 'green',
    textAlign: "center",
  },
  alertItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  alertType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  alertMessage: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalContentText: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default AlertScreen;
