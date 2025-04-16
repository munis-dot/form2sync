import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function ProfileScreen({ navigation }: any) {

  const menuItems = [
    { name: 'Inventory', icon: 'inventory', navigation: 'InventoryScreen' },
    { name: 'Disease', icon: 'healing' },
    { name: 'Temperature', icon: 'thermostat', navigation: 'WeatherScreen' },
    { name: 'Ads', icon: 'campaign', navigation: 'adListScreen' },
    { name: 'Loan', icon: 'account-balance', navigation: 'LoanScreen' },
    { name: 'Farming Practices', icon: 'grass', navigation: 'FarmingPractices' },
    { name: 'Data Analytics', icon: 'analytics', navigation: 'SalesScreen' },
    { name: 'Feedback', icon: 'feedback', navigation: 'FeedbackListScreen' },
    { name: 'News', icon: 'article', navigation: 'NewsScreen' },
    { name: 'Notifications', icon: 'notifications', navigation: 'NotificationScreen' },
    { name: 'Order Management', icon: 'shopping-bag', navigation: 'orderManagementScreen' },
    { name: 'Logout', icon: 'logout' },

  ];

  const menuItems2 = [
    { name: 'Cart', icon: 'shopping-cart', navigation: 'Cart' },
    { name: 'My Orders', icon: 'assignment', navigation: 'orderManagementScreen' },
    { name: 'Message', icon: 'message', navigation: 'ChatListScreen' },
    { name: 'Category', icon: 'category', navigation: 'CategoryScreen' },
    { name: 'News', icon: 'article', navigation: 'NewsScreen' },
    { name: 'Temperature', icon: 'thermostat', navigation: 'WeatherScreen' },
    { name: 'Logout', icon: 'logout' },
  ];

  const logout = () => {
    AsyncStorage.removeItem('user');
    AsyncStorage.setItem('isLoggedIn', 'false');
    navigation.navigate('LngScreen')
  }

  const user = useSelector((state: RootState) => state.auth.user)
  const options = user?.type == 'customer' ? menuItems2 : menuItems;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Hi {user?.userName}</Text>
      </View>

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740',
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {options.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => {
            if (item.name === 'Logout') logout();
            else if (item.navigation) navigation.navigate(item.navigation);
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
