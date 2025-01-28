import { Alert, Button, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { handleUser } from '../slice/authSlice'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
const LoginSCreen = ({ navigation }: any) => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)

    const handleChange = (name: string, value: string | number) => {
        dispatch(handleUser({ [name]: value }))
    }
   
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon size={20} name='arrow-left' style={styles.backArrow} />
            </TouchableOpacity>
            <View style={styles.topSection}>
                <Text style={styles.title}>Welcome back! Glad to see you, Again!</Text>
                <TextInput style={styles.input} placeholder='User Name' value={user?.userName} onChangeText={val => handleChange('userName', val)} />
                <TextInput keyboardType='number-pad' style={styles.input} placeholder='phone' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                <TouchableHighlight style={styles.submitBtn}><Text style={styles.submitText}>Login</Text></TouchableHighlight>
            </View>
            <View style={styles.bottomAction}>
                <Text style={{ fontSize: 16 }}>Don't have an account? </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('signupScreen')}><Text style={{ fontSize: 16, fontWeight: '500', color: '#29660C' }}>Register Now</Text></TouchableOpacity>
            </View>
        </View>
    //     <View style={styles.container}>
    //   {!confirmResult ? (
    //     <>
    //       <Text style={styles.label}>Enter Phone Number:</Text>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Phone Number (e.g., +1234567890)"
    //         value={phoneNumber}
    //         onChangeText={setPhoneNumber}
    //         keyboardType="phone-pad"
    //       />
    //       <Button title="Send Code" onPress={handleSendCode} />
    //     </>
    //   ) : (
    //     <>
    //       <Text style={styles.label}>Enter Verification Code:</Text>
    //       <TextInput
    //         style={styles.input}
    //         placeholder="Verification Code"
    //         value={verificationCode}
    //         onChangeText={setVerificationCode}
    //         keyboardType="numeric"
    //       />
    //       <Button title="Verify Code" onPress={handleVerifyCode} />
    //     </>
    //   )}
    // </View>
    )
}

export default LoginSCreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '85%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 5,
        fontSize: 16,
        margin: 30,
        height: 60,
        backgroundColor: '#E8ECF4'
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
      },
      
    backButton: {
        position: 'absolute',
        top: 40,
        left: 30,
        marginLeft: -14, // Center align the back arrow
        zIndex: 10,
    },
    backArrow: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#f7f7f7',
        borderRadius: 12,
    },
    topSection: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: "100%",
        marginTop:90,
    },
    bottomAction: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        fontSize: 35,
        fontFamily: 'poppins',
        fontWeight: 'bold'
    },
    submitBtn:{
        backgroundColor:'#29660C',
        height:60,
        width:'85%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginTop:20,
    },
    submitText:{
        color:'#ffffff',
        fontSize:18,
        fontWeight:'bold',
    },
})