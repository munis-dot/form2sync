import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleUser } from '../slice/authSlice';

const LogInAsScreen = ({ navigation }: any) => {
  const dispatch: AppDispatch = useDispatch();
  const loginType = useSelector((state: RootState) => state.auth.user?.type);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />
      <View style={{ flexGrow: 1, justifyContent: 'center', alignContent: 'center', flexDirection: 'column', gap: 66 }}>
        <Text style={styles.title}>Login As </Text>
        <TouchableOpacity onPress={()=> dispatch(handleUser({ type: 'farmer' }))}><Image source={require('../../assets/farmer.png')} style={loginType === 'farmer' ? styles.img : styles.imgWithGrey} /></TouchableOpacity>
        <TouchableOpacity onPress={()=> dispatch(handleUser({ type: 'customer' }))}><Image source={require('../../assets/customer.png')} style={loginType === 'customer' ? styles.img : styles.imgWithGrey} /></TouchableOpacity>
      </View>
      <TouchableOpacity disabled={!loginType} style={{ width: "100%", justifyContent: 'flex-start', alignItems: 'flex-end', marginBottom: 30 }} onPress={() => navigation.navigate('signupScreen')}>
        <View style={[styles.innerCircle, !loginType && { backgroundColor: 'grey' }]}>
          <Icon name="arrow-right" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default LogInAsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign:'center',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1EA53B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    position: 'relative',
  },
  blackAndWhite: {
    filter: 'grayscale(100%)', // This works with react-native-web
  },
  img: {
    width: 200,
    height: 200,
  },
  imgWithGrey: {
    width: 200,
    height: 200,
    filter: 'grayscale(100%)'
  }
})