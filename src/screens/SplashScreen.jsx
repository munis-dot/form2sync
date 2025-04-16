import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../slice/authSlice';

const SplashScreen = ({ navigation }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start(() => {
            checkLogin();
        });
    }, [opacity]);

    const checkLogin = async () => {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const user = await AsyncStorage.getItem('user');
        console.log("user", user)
        user && dispatch(login(JSON.parse(user)))
        setTimeout(() => {
            if (isLoggedIn && user) {
                if (JSON.parse(user).type == 'customer') {
                    navigation.navigate('HomeScreen1')
                }
                else {
                    navigation.replace('HomeScreen')
                };
            } else {
                navigation.replace('LngScreen');
            }
        }, 1000); // Simulate a 1-second delay after the animation
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <Animated.Image
                source={require('../../assets/logo.png')} // Add your PNG image here
                style={[styles.image, { opacity }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;
