import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import Modal from 'react-native-modal'; 

export default function cropR() {
  const initialFormData = {
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Temperature: "",
    Humidity: "",
    pH: "",
    Rainfall: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState('');

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some(field => field === "")) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.0.105:5000/predict-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data.result); 
      setModalVisible(true); 

      setFormData(initialFormData);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <ThemedView style={styles.container}>
      
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput 
              placeholder="Enter Nitrogen" 
              value={formData.Nitrogen}
              onChangeText={(text) => handleChange("Nitrogen", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput 
              placeholder="Enter Phosphorus" 
              value={formData.Phosphorus}
              onChangeText={(text) => handleChange("Phosphorus", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput 
              placeholder="Enter Potassium" 
              value={formData.Potassium}
              onChangeText={(text) => handleChange("Potassium", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput 
              placeholder="Enter Temperature" 
              value={formData.Temperature}
              onChangeText={(text) => handleChange("Temperature", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput 
              placeholder="Enter Humidity" 
              value={formData.Humidity}
              onChangeText={(text) => handleChange("Humidity", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput 
              placeholder="Enter pH" 
              value={formData.pH}
              onChangeText={(text) => handleChange("pH", text)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput 
              placeholder="Enter Rainfall" 
              value={formData.Rainfall}
              onChangeText={(text) => handleChange("Rainfall", text)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <Button title="Predict" onPress={handleSubmit} color="#6200ee" />
        </>
      )}

      
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Recommendation Result</Text>
          <Text style={styles.modalText}>{result}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#b0b0b0',
    borderWidth: 1,
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  modalButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
