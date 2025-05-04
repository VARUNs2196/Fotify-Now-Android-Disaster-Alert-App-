import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Navbar = ({ onSourceSelect }) => {
  const [selectedSource, setSelectedSource] = useState('all'); 

  const handlePress = (source) => {
    setSelectedSource(source);
    onSourceSelect(source); 
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navButton, selectedSource === 'all' && styles.selectedButton]}
        onPress={() => handlePress('all')}
      >
        <Text style={styles.navButtonText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, selectedSource === 'news' && styles.selectedButton]}
        onPress={() => handlePress('news')}
      >
        <Text style={styles.navButtonText}>News</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, selectedSource === 'reddit' && styles.selectedButton]}
        onPress={() => handlePress('reddit')}
      >
        <Text style={styles.navButtonText}>Reddit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, selectedSource === 'fema' && styles.selectedButton]}
        onPress={() => handlePress('fema')}
      >
        <Text style={styles.navButtonText}>FEMA</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navButton, selectedSource === 'weather' && styles.selectedButton]}
        onPress={() => handlePress('weather')}
      >
        <Text style={styles.navButtonText}>Weather</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: {
    padding: 10,
  },
  selectedButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Navbar;