import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoding from 'react-native-geocoding';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

// Initialize Geocoding with your API key
Geocoding.init("YOUR_GOOGLE_MAPS_API_KEY");

// OpenWeatherMap API key
const WEATHER_API_KEY = "f8e787da959d6f6765ac9da2c8adaeec";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

const WeatherScreen = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getLocationDetails = (lat:number,lon:number) => {
    console.log(lat,lon)
    return axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=37.421998333333335&lon=-122.084&limit=5&appid=f8e787da959d6f6765ac9da2c8adaeec`)
  }

  const getCurrentLocation = () => {
    setLoading(true);
    
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const response = await getLocationDetails(position.coords.latitude, position.coords.longitude);
          console.log("response", response)
          // const address = response.results[0].formatted_address;
          // setLocation(address);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        } catch (error) {
          console.log(error)
          Alert.alert('Error', 'Failed to get location details');
          setLoading(false);
        }
      },
      error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const searchLocation = async () => {
    if (!location.trim()) return;

   

    setLoading(true);
    try {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
      );
  
      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        Alert.alert('City not found');
        setLoading(false);
        return;
      }
  
      const { latitude, longitude } = geoRes.data.results[0];
      fetchWeather(latitude, longitude);
    } catch (error) {
      Alert.alert('Error', 'Location not found');
      console.log(error)
      setLoading(false);
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();

      setWeather({
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSearchMode(!searchMode)}>
          <Icon name={searchMode ? "close" : "magnify"} size={24} color="#00A41C" />
        </TouchableOpacity>
        {searchMode ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Search location..."
              onSubmitEditing={searchLocation}
            />
          </View>
        ) : (
          <View style={styles.locationContainer}>
            <Icon name="map-marker" size={24} color="#00A41C" />
            <Text style={styles.locationText} numberOfLines={1}>
              {location || 'Loading location...'}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={getCurrentLocation}>
          <Icon name="crosshairs-gps" size={24} color="#00A41C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#00A41C" />
        ) : weather ? (
          <>
            <View style={styles.weatherCard}>
              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                }}
              />
              <Text style={styles.temperature}>{weather.temp}°C</Text>
              <Text style={styles.description}>
                {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailCard}>
                <Icon name="thermometer" size={24} color="#00A41C" />
                <Text style={styles.detailLabel}>Feels Like</Text>
                <Text style={styles.detailValue}>{weather.feels_like}°C</Text>
              </View>

              <View style={styles.detailCard}>
                <Icon name="water-percent" size={24} color="#00A41C" />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>

              <View style={styles.detailCard}>
                <Icon name="weather-windy" size={24} color="#00A41C" />
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} m/s</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>Unable to load weather data</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#282c3f',
    marginLeft: 8,
    flex: 1,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  weatherCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 24,
  },
  weatherIcon: {
    width: 150,
    height: 150,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#282c3f',
    marginVertical: 8,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  detailCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WeatherScreen;