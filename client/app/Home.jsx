import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, BackHandler, Alert } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = () => {
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem("fullName");
        if (storedFullName) {
          setFullName(storedFullName);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    getUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => backHandler.remove();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("fullName");
      // Navigate to the login screen after logout
      router.push("/login"); // Change this to the path of your index screen if different
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfile = () => {
    Alert.alert("Profile", "Choose an option:", [
      { text: "Profile", onPress: () => router.push("/profile") },
      { text: "Logout", onPress: handleLogout },
      { text: "Cancel", onPress: () => console.log("Cancel pressed"), style: "cancel" },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome, {fullName || "User"}</Text>
          <Button mode="text" onPress={handleLogout} style={styles.logoutButton}>
            Logout
          </Button>
        </View>

        <Card style={[styles.card, { backgroundColor: "#E0F7FA" }]}>
          <Card.Content>
            <MaterialCommunityIcons name="seed-outline" size={24} color="#00796B" />
            <Title style={styles.cardTitle}>Crop Recommendation</Title>
            <Paragraph style={styles.cardParagraph}>
              Get the best crop to cultivate based on your data.
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" color="#00796B" style={styles.button} onPress={() => router.push("/cropR")}>
              Show
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.card, { backgroundColor: "#FFF3E0" }]}>
          <Card.Content>
            <MaterialCommunityIcons name="sprout" size={24} color="#E65100" />
            <Title style={styles.cardTitle}>Fertilizer Recommendation</Title>
            <Paragraph style={styles.cardParagraph}>
              Find the ideal fertilizer for your selected crop.
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" color="#E65100" style={styles.button} onPress={() => router.push("/cropF")}>
              Show
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.card, { backgroundColor: "#E3F2FD" }]}>
          <Card.Content>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#0277BD" />
            <Title style={styles.cardTitle}>Weather Information</Title>
            <Paragraph style={styles.cardParagraph}>
              Click to view the latest weather updates.
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" color="#0277BD" style={styles.button} onPress={() => router.push("/weather")}>
              Show
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.card, { backgroundColor: "#F3E5F5" }]}>
          <Card.Content>
            <MaterialCommunityIcons name="newspaper" size={24} color="#8E24AA" />
            <Title style={styles.cardTitle}>News</Title>
            <Paragraph style={styles.cardParagraph}>
              Click to view the latest agricultural news.
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" color="#8E24AA" style={styles.button} onPress={() => router.push("/news")}>
              Show
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    marginLeft: 10,
  },
  card: {
    marginBottom: 25,
    borderRadius: 15,
    elevation: 4,
    width: "91%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardParagraph: {
    fontSize: 16,
    marginVertical: 12,
  },
  cardActions: {
    justifyContent: "flex-end",
  },
  button: {
    marginRight: 10,
  },
});

export default Home;
