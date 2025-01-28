import { Alert, Button, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { handleUser } from '../slice/authSlice'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
const RegisterScreen = ({ navigation }: any) => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user)

    const handleChange = (name: string, value: string | number) => {
        dispatch(handleUser({ [name]: value }))
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >
            {/* <ScrollView style={styles.scrollContainer}> */}
                <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
                <View style={styles.wrapper}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon size={20} name='arrow-left' style={styles.backArrow} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Create Profile</Text>
                    </View>
                    <View style={styles.topSection}>
                        <Image style={{ marginBottom: 30 }} source={require('../../assets/avatar.png')} />
                        <TextInput style={styles.input} placeholder='User Name' value={user?.userName} onChangeText={val => handleChange('userName', val)} />
                        <TextInput keyboardType='number-pad' style={styles.input} placeholder='kissan Id' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                        <TextInput keyboardType='number-pad' style={styles.input} placeholder='farm Name' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput keyboardType='number-pad' style={[styles.input, { width: '40%' }]} placeholder='country' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                            <TextInput keyboardType='number-pad' style={[styles.input, { width: '40%' }]} placeholder='state' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                            <TextInput keyboardType='number-pad' style={[styles.input, { width: '40%' }]} placeholder='city' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                            <TextInput keyboardType='number-pad' style={[styles.input, { width: '40%' }]} placeholder='village' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                        </View>
                        <TextInput keyboardType='number-pad' style={[styles.input, { marginTop: 15 }]} placeholder='phone' value={user?.mobile as any} onChangeText={val => handleChange('mobile', val)} />
                        <TouchableHighlight onPress={()=>navigation.navigate('homeScreen')} style={styles.submitBtn}><Text style={styles.submitText}>Register</Text></TouchableHighlight>
                    </View>
                </View>
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
        marginTop: 90,
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