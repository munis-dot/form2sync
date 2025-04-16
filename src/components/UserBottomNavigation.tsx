import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import ChatListScreen from '../screens/ChatListScreen';
import CategoryScreen from '../screens/CategoryScreen';


const Tab = createBottomTabNavigator();

export default function UserBottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'green', // Active icon color
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Filter':
              iconName = 'filter-alt';
              break;
            case 'Category':
              iconName = 'category';
              break;
            case 'Message':
              iconName = 'message';
              break;
            case 'Cart':
              iconName = 'shopping-cart';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <Icon
              name={iconName}
              size={size || 24}
              color={focused ? 'green' : color || 'gray'}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Filter" component={SearchScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Message" component={ChatListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}
