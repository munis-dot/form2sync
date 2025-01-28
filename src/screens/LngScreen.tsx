import { Image, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { handleUser } from '../slice/authSlice'

const LngScreen = ({ navigation }: any) => {
  const dispatch: AppDispatch = useDispatch();
  const lng = useSelector((state: RootState) => state.auth.user?.lng);
  const lngList = ['தமிழ்', 'English', 'हिन्दी', 'മലയാളം', 'తెలుగు', 'ಕನ್ನಡ'];
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <Text style={styles.title}>Choose Your Language</Text>
      <Image source={require('../../assets/language.png')} />
      <View style={styles.languageCollection}>
        {lngList.map(obj => {
          return (
            <TouchableOpacity key={obj} style={[styles.lngBtn, obj === lng && { backgroundColor: '#1EA53B' }]} onPress={() => {
              dispatch(handleUser({ lng: obj }))
            }}><Text style={[styles.lngText, obj === lng && { color: '#fff' }]}>{obj}</Text></TouchableOpacity>
          )
        })}
      </View>
      <TouchableOpacity disabled={!lng} style={{ width: "100%", justifyContent: 'flex-start', alignItems: 'flex-end' }} onPress={() => navigation.navigate('loginAsScreen')}>
        <View style={[styles.innerCircle, !lng && { backgroundColor: 'grey' }]}>
          <Icon name="arrow-right" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default LngScreen

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
  },
  languageCollection: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100
  },
  lngBtn: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 20,
    marginHorizontal: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',

  },
  lngText: {
    fontSize: 18,
    fontWeight: 'bold'
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
})