import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';

// Placeholder components for the tabs

const SearchScreen = () => (
  <View>
    <Text>Search Screen</Text>
  </View>
);

const CategoryScreen = () => (
  <View>
    <Text>Category Screen</Text>
  </View>
);

const MessageScreen = () => (
  <View>
    <Text>Message Screen</Text>
  </View>
);

const CartScreen = () => (
  <View>
    <Text>Cart Screen</Text>
  </View>
);

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
            case 'Search':
              iconName = 'search';
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
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}
