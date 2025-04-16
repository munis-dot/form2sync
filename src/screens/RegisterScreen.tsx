import { Alert, Button, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { handleUser } from '../slice/authSlice'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
const RegisterScreen = ({ navigation }: any) => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)

    const handleChange = (name: string, value: string | number) => {
        dispatch(handleUser({ [name]: value }))
    }

    const register = () => {
        if (!user?.userName || (user.type === 'farmer' && (!user?.kisanId || !user?.farmName)) || !user?.userName || !user?.phone) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }
        const { state, city, country, village, ...restUser } = user;

        axios.post('http://192.168.14.130:5000/auth/signup', {
            ...restUser,
            address: { state, city, country, village }
        }).then(res => {
            Alert.alert('Success', res.data.message);
            AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            AsyncStorage.setItem('isLoggedIn', 'true');
            navigation.navigate(user?.type === 'farmer' ? 'HomeScreen' : 'HomeScreen1');
        })
            .catch(err => {
                Alert.alert('Error', err?.response?.data?.message);
                console.log(err);
            })
    }
    console.log(user)
    return (
        <KeyboardAvoidingView
            style={styles.container}
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >
            <ScrollView >
                <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon size={20} name='arrow-left' style={styles.backArrow} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Create Profile</Text>
                    </View>
                    <View style={styles.topSection}>
                        <Image style={{ marginBottom: 30 }} source={{uri:'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}} />
                        <TextInput style={styles.input} placeholder='User Name' value={user?.userName} onChangeText={val => handleChange('userName', val)} />
                        <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' value={user?.password} onChangeText={val => handleChange('password', val)} />
                        {user?.type === 'farmer' &&
                            <>
                                <TextInput keyboardType='number-pad' style={styles.input} placeholder='kisan Id' value={user?.kisanId as any} onChangeText={val => handleChange('kisanId', val)} />
                                <TextInput style={styles.input} placeholder='farm Name' value={user?.farmName as any} onChangeText={val => handleChange('farmName', val)} />
                            </>
                        }

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput style={[styles.input, { width: '40%' }]} placeholder='country' value={user?.country as any} onChangeText={val => handleChange('country', val)} />
                            <TextInput style={[styles.input, { width: '40%' }]} placeholder='state' value={user?.state as any} onChangeText={val => handleChange('state', val)} />
                            <TextInput style={[styles.input, { width: '40%' }]} placeholder='city' value={user?.city as any} onChangeText={val => handleChange('city', val)} />
                            <TextInput style={[styles.input, { width: '40%' }]} placeholder='village' value={user?.village as any} onChangeText={val => handleChange('village', val)} />
                        </View>
                        <TextInput keyboardType='number-pad' style={[styles.input, { marginTop: 15 }]} placeholder='phone' value={user?.phone as any} onChangeText={val => handleChange('phone', val)} />
                        <TouchableHighlight onPress={register} style={styles.submitBtn}><Text style={styles.submitText}>Register</Text></TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
    },
    wrapper: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        // flexGrow: 1
    },
    input: {
        width: '85%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        height: 60,
        backgroundColor: '#F7F8F9'
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    headerText: {
        marginLeft: 120,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2b395f'
    },
    backArrow: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#f7f7f7',
        borderRadius: 12,
    },
    topSection: {
        // flex: ,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: "100%",
        marginTop: 10,
    },
    title: {
        fontSize: 35,
        fontFamily: 'poppins',
        fontWeight: 'bold'
    },
    submitBtn: {
        backgroundColor: '#29660C',
        height: 60,
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    submitText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})