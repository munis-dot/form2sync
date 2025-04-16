import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import SplashScreen from './src/screens/SplashScreen';
import LngScreen from './src/screens/LngScreen';
import { store } from './src/redux/store';
import LoginAsScreen from './src/screens/LogInAsScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import OTPverify from './src/screens/OTPverify';
import { StatusBar } from 'react-native';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import BottomNavigator from './src/components/BottomNavigation';
import ProfileScreen from './src/screens/ProfileScreen';
import UserBottomNavigation from './src/components/UserBottomNavigation';
import StockAddScreen from './src/screens/StockAddScreen';
import StockManagementScreen from './src/screens/StockManagementScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import SearchScreen from './src/screens/SearchScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import AddPostScreen from './src/screens/AddPostScreen';
import AdListScreen from './src/screens/AdListScreen';
import CartScreen from './src/screens/CartScreen';
import ProductViewScreen from './src/screens/ProductViewScreen';
import CheckoutScreen from './src/screens/CheckoutPage';
import NotificationScreen from './src/screens/NotificationScreen';
import OrderManagementScreen from './src/screens/OrderManagementScreen';
import NewsScreen from './src/screens/NewsScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import LoanScreen from './src/screens/LoanScreen';
import FarmingPractices from './src/screens/FarmingPractices';
import SalesAnalyticsScreen from './src/screens/SalesAnalyticsScreen';
import ChatScreen from './src/screens/ChatScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import FeedbackListScreen from './src/screens/FeedbackListScreen';
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <CartProvider>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="SplashScreen">
                            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="adListScreen" component={AdListScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="addPostScreen" component={AddPostScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="LngScreen" component={LngScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="loginAsScreen" component={LoginAsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="loginScreen" component={LoginScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="signupScreen" component={SignupScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="otpVerify" component={OTPverify} options={{ headerShown: false }} />
                            <Stack.Screen name="registerScreen" component={RegisterScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="profileScreen" component={ProfileScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="WeatherScreen" component={WeatherScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="searchScreen" component={SearchScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="SalesScreen" component={SalesAnalyticsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="LoanScreen" component={LoanScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="FarmingPractices" component={FarmingPractices} options={{ headerShown: false }} />
                            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="HomeScreen" component={BottomNavigator} options={{ headerShown: false }} />
                            <Stack.Screen name="HomeScreen1" component={UserBottomNavigation} options={{ headerShown: false }} />
                            <Stack.Screen name="StockAddScreen" component={StockAddScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="InventoryScreen" component={StockManagementScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="ProductView" component={ProductViewScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="NewsScreen" component={NewsScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
                            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
                            <Stack.Screen name='orderManagementScreen' component={OrderManagementScreen} options={{ headerShown: false }} />
                            <Stack.Screen name='CategoryScreen' component={CategoryScreen} options={{ headerShown: false }} />
                            <Stack.Screen name='FeedbackScreen' component={FeedbackScreen} options={{ headerShown: false }} />
                            <Stack.Screen name='FeedbackListScreen' component={FeedbackListScreen} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </CartProvider>
            </Provider>
        </SafeAreaProvider>
    );
}

export default App;
