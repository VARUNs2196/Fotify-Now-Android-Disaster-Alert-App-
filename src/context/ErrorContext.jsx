// contexts/ErrorContext.js
import React, { createContext, useState, useContext } from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const showError = (message) => {
    setError(message);
  };
  
  const hideError = () => {
    setError(null);
  };
  
  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      {error && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={true}
          onRequestClose={hideError}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="OK" onPress={hideError} />
            </View>
          </View>
        </Modal>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 16,
  }
});