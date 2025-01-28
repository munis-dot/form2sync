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
// import LoginScreen from './screens/LoginScreen';
// import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="SplashScreen">
                    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="LngScreen" component={LngScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="loginAsScreen" component={LoginAsScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="loginScreen" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="signupScreen" component={SignupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="otpVerify" component={OTPverify} options={{ headerShown: false }} />
                    <Stack.Screen name="registerScreen" component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="profileScreen" component={ProfileScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="homeScreen" component={HomeScreen} options={{ headerShown: false }} />
                    {/* <Stack.Screen name="homeScreen2" component={BottomNavigator} options={{ headerShown: false }} /> */}
                    
                    {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App;
