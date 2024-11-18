import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';

export default function CropF() {  // Updated component name to follow PascalCase convention
  const initialFormData = {
    temp: "",
    humid: "",
    mois: "",
    soil: "Black",
    crop: "Barley",
    nitro: "",
    pota: "",
    phos: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateInputs = () => {
    const { temp, humid, mois, nitro, pota, phos } = formData;
    return temp && humid && mois && nitro && pota && phos &&
           !isNaN(temp) && !isNaN(humid) && !isNaN(mois) &&
           !isNaN(nitro) && !isNaN(pota) && !isNaN(phos);
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      setModalMessage("Please fill out all fields with valid numbers.");
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.105:5000/predict-fertilizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setModalMessage(data.result); 
      setModalVisible(true); 

      // Clear form data after receiving result
      setFormData(initialFormData);
    } catch (error) {
      setModalMessage("Error occurred while fetching data: " + error.message);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Temperature"
            value={formData.temp}
            onChangeText={(text) => handleChange("temp", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Humidity"
            value={formData.humid}
            onChangeText={(text) => handleChange("humid", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Moisture"
            value={formData.mois}
            onChangeText={(text) => handleChange("mois", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <Text style={styles.label}>Soil Type</Text>
          <Picker
            selectedValue={formData.soil}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange("soil", itemValue)}>
            <Picker.Item label="Black" value="Black" />
            <Picker.Item label="Clayey" value="Clayey" />
            <Picker.Item label="Loamy" value="Loamy" />
            <Picker.Item label="Red" value="Red" />
            <Picker.Item label="Sandy" value="Sandy" />
          </Picker>

          <Text style={styles.label}>Crop Type</Text>
          <Picker
            selectedValue={formData.crop}
            style={styles.picker}
            onValueChange={(itemValue) => handleChange("crop", itemValue)}>
            <Picker.Item label="Barley" value="Barley" />
            <Picker.Item label="Cotton" value="Cotton" />
            <Picker.Item label="Ground Nuts" value="Ground Nuts" />
            <Picker.Item label="Maize" value="Maize" />
            <Picker.Item label="Millets" value="Millets" />
            <Picker.Item label="Oil Seeds" value="Oil Seeds" />
            <Picker.Item label="Paddy" value="Paddy" />
            <Picker.Item label="Pulses" value="Pulses" />
            <Picker.Item label="Sugarcane" value="Sugarcane" />
            <Picker.Item label="Tobacco" value="Tobacco" />
            <Picker.Item label="Wheat" value="Wheat" />
            <Picker.Item label="Rice" value="Rice" />
          </Picker>

          <TextInput
            placeholder="Nitrogen"
            value={formData.nitro}
            onChangeText={(text) => handleChange("nitro", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Potassium"
            value={formData.pota}
            onChangeText={(text) => handleChange("pota", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Phosphorus"
            value={formData.phos}
            onChangeText={(text) => handleChange("phos", text)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <Button title="Predict" onPress={handleSubmit} color="#6200ee" />
        {loading && <ActivityIndicator size="large" color="#6200ee" style={styles.loadingIndicator} />}

        
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
