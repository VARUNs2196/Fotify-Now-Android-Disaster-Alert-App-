import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const NewsDetailScreen = ({ route }) => {
  const { newsItem } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{newsItem.title}</Text>
      
      <View style={styles.metaContainer}>
        <Text style={styles.source}>{newsItem.source.toUpperCase()}</Text>
        <Text style={styles.date}>{new Date(newsItem.date).toLocaleString()}</Text>
      </View>

      {newsItem.location && (
        <Text style={styles.location}>Location: {newsItem.location}</Text>
      )}

      <Text style={styles.description}>
        {newsItem.description || 'No description available'}
      </Text>

      {newsItem.url && (
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => Linking.openURL(newsItem.url)}
        >
          <Text style={styles.linkText}>View Original Source</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  source: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#777',
  },
  location: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: '#1a73e8',
    padding: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewsDetailScreen;