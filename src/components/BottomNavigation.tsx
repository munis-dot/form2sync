import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StockAddScreen from '../screens/StockAddScreen';
import NewsScreen from '../screens/NewsScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
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
            case 'News':
              iconName = 'article';
              break;
            case 'StockAdd':
              iconName = 'add'; // "+" icon for StockAdd tab
              break;
            case 'Msg':
              iconName = 'message';
              break;
            case 'Orders':
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
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen
        name="StockAdd"
        component={StockAddScreen}
        options={{
          tabBarLabel: () => null, // Remove label for StockAdd tab
        }}
      />
      <Tab.Screen name="Msg" component={ChatListScreen} />
      <Tab.Screen name="Orders" component={OrderManagementScreen} />
    </Tab.Navigator>
  );
}
