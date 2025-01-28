import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
            case 'Sale':
              iconName = 'add'; // "+" icon for Sale tab
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
      <Tab.Screen name="News" component={HomeScreen} />
      <Tab.Screen
        name="Sale"
        component={HomeScreen}
        options={{
          tabBarLabel: () => null, // Remove label for Sale tab
        }}
      />
      <Tab.Screen name="Msg" component={HomeScreen} />
      <Tab.Screen name="Orders" component={HomeScreen} />
    </Tab.Navigator>
  );
}