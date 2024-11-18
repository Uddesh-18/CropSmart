import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import axios from "axios";

const WeatherScreen = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`
      );
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=mumbai&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`
      );
      setForecastData(forecastResponse.data.list);
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentWeather || forecastData.length === 0) return <Text style={styles.loading}>Loading...</Text>;

  const { main, weather, wind, sys } = currentWeather;
  const temperature = Math.round(main.temp);
  const minTemp = Math.round(main.temp_min);
  const maxTemp = Math.round(main.temp_max);
  const humidity = main.humidity;
  const windSpeed = wind.speed;
  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();
  const weatherIcon = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`; // Higher resolution icon

  // Process the forecast data
  const dailyForecasts = {};
  forecastData.forEach((entry) => {
    const date = new Date(entry.dt * 1000).toDateString();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        temp: Math.round(entry.main.temp),
        weather: entry.weather[0].main,
        icon: entry.weather[0].icon,
        humidity: entry.main.humidity,
        windSpeed: entry.wind.speed,
      };
    }
  });

  const forecastItems = Object.keys(dailyForecasts).map((date) => (
    <View key={date} style={styles.forecastCard}>
      <Text style={styles.forecastDate}>{date}</Text>
      <Image source={{ uri: `http://openweathermap.org/img/wn/${dailyForecasts[date].icon}@2x.png` }} style={styles.forecastIcon} />
      <Text style={styles.forecastTemp}>{dailyForecasts[date].temp}°</Text>
      <Text style={styles.forecastWeather}>{dailyForecasts[date].weather}</Text>
      <Text style={styles.forecastHumidity}>Humidity: {dailyForecasts[date].humidity}%</Text>
      <Text style={styles.forecastWind}>Wind Speed: {dailyForecasts[date].windSpeed} m/s</Text>
    </View>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: weatherIcon }} style={styles.icon} />
        <Text style={styles.temperature}>{temperature}°</Text>
        <Text style={styles.weather}>{weather[0].main}</Text>
        <Text style={styles.tempRange}>
          Max: {maxTemp}° Min: {minTemp}°
        </Text>
        <Text style={styles.humidity}>Humidity: {humidity}%</Text>
        <Text style={styles.wind}>Wind Speed: {windSpeed} m/s</Text>
        <Text style={styles.sunsetSunrise}>
          Sunrise: {sunrise} | Sunset: {sunset}
        </Text>
        <Text style={styles.date}>Today, {new Date().toDateString()}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastContainer}>
        {forecastItems}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4a3b75",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#5c4f8c",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
    width: "100%",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: "#fff", // Make the icon white
  },
  temperature: {
    fontSize: 80,
    color: "#fff",
    fontWeight: "bold",
  },
  weather: {
    fontSize: 32,
    color: "#fff",
    marginVertical: 10,
  },
  tempRange: {
    fontSize: 20,
    color: "#fff",
  },
  humidity: {
    fontSize: 18,
    color: "#fff",
  },
  wind: {
    fontSize: 18,
    color: "#fff",
  },
  sunsetSunrise: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 5,
  },
  date: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 10,
  },
  loading: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
  forecastContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  forecastCard: {
    backgroundColor: "#5c4f8c",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    width: 100,
    elevation: 2,
  },
  forecastDate: {
    color: "#fff",
    fontWeight: "bold",
  },
  forecastIcon: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    color: "#fff",
    fontSize: 20,
  },
  forecastWeather: {
    color: "#fff",
  },
  forecastHumidity: {
    color: "#fff",
  },
  forecastWind: {
    color: "#fff",
  },
});

export default WeatherScreen;
