import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {

  const menuItems = [
    { name: 'Inventory', icon: 'inventory' },
    { name: 'Disease', icon: 'healing' },
    { name: 'Temperature', icon: 'thermostat' },
    { name: 'Ads', icon: 'campaign' },
    { name: 'Loan', icon: 'account-balance' },
    { name: 'Farming Practices', icon: 'grass' },
    { name: 'Data Analytics', icon: 'analytics' },
    { name: 'Feedback', icon: 'feedback' },
    { name: 'News', icon: 'article' },
    { name: 'Notifications', icon: 'notifications' },
    { name: 'Order Management', icon: 'shopping-bag' },
  ];

  const menuItems2 = [
    { name: 'Cart', icon: 'shopping-cart' },
    { name: 'My Orders', icon: 'assignment' },
    { name: 'Message', icon: 'message' },
    { name: 'Category', icon: 'category' },
    { name: 'News', icon: 'article' },
    { name: 'Temperature', icon: 'thermostat' },
    { name: 'Logout', icon: 'logout' },
  ];

  const logout = ()=>{
    AsyncStorage.removeItem('user');
    AsyncStorage.setItem('isLoggedIn','true');
    navigation.navigate('LngScreen')
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Hi Munis</Text>
      </View>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems2.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => {
            if (item.name === 'Logout')  logout();
            else Alert.alert(`${item.name} clicked`)
          }}>
            <Icon name={item.icon} size={24} color="#2d6a4f" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light green background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Dark green shade for header
    padding: 15,
  },
  greeting: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#95d5b2',
  },
  menuContainer: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // Light green button background
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#1b4332',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
