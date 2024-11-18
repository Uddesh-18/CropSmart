import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    
    if (!password || password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.105:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      
      if (response.ok) {
        const fullName = data.full_name;
        // Store full name in AsyncStorage
        await AsyncStorage.setItem("fullName", fullName);
        Alert.alert("Success", data.message);
        // Navigate to the Home screen
        router.replace("/Home");
      } else {
        Alert.alert("Login Failed", data.error || "Unknown error occurred.");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert(
        "Error",
        "Network error. Please check your connection or try again later."
      );
    }
  };

  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  
  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  
  const handleForgotPasswordRedirect = () => {
    router.push("/forgot-password");
  };

  return (
    <View style={styles.container}>
      
      <Image
        source={require("@/assets/images/login.jpg")} 
        style={styles.logo}
      />

      <Text style={styles.title}>Sign In</Text>

      {/* Email Input with Icon */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input with Icon */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
        />
      </View>

      
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#ccc" }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleForgotPasswordRedirect}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Don't have an account?</Text>

      
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegisterRedirect}
      >
        <Text style={styles.registerButtonText}>Register Here</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 250, 
    height: 250, 
    marginBottom: 0, 
    resizeMode: "contain", 
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#007bff",
    marginTop: 15,
    fontSize: 16,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  registerButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#28a745",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
