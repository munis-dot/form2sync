import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import React from 'react'

const HomeScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <View style={styles.header}>
                <Text style={styles.quote}>Happy Farming</Text>
                <TouchableHighlight onPress={() => navigation.navigate('profileScreen')}>
                    <Image style={styles.avatar} source={require('../../assets/avatar.png')} />
                </TouchableHighlight>
            </View>
            <TextInput placeholder='🔍 search' style={styles.search} />
            <ScrollView>
                <Image style={styles.banner} source={require('../../assets/banner2.png')} />
                <Text style={styles.categoryText}>Popular Categories</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', marginLeft: 5, justifyContent:'center' }}>
                        <View style={styles.catgIconWrapper}>
                            <Image style={styles.catgIcon} source={require('../../assets/tomoto.png')} />
                        </View>
                        <Text style={styles.itemText}>Vegetables</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.catgIconWrapper}>
                            <Image style={styles.catgIcon} source={require('../../assets/mango.png')} />
                        </View>
                        <Text style={styles.itemText}>Fruits</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.catgIconWrapper}>
                            <Image style={styles.catgIcon} source={require('../../assets/egg.png')} />
                        </View>
                        <Text style={styles.itemText}>Eggs and milk</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.catgIconWrapper}>
                            <Image style={styles.catgIcon} source={require('../../assets/nuts.png')} />
                        </View>
                        <Text style={styles.itemText}>Nuts</Text>
                    </View>
                </View>

                <Text style={styles.categoryText}>You Likes</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.itemWrapper}>
                        <Image style={styles.image} source={require('../../assets/mangos.jpg')} />
                        <Text style={styles.itemText}>Mango</Text>
                        <Text style={styles.price}>1kg ₹80/-</Text>
                        <Text>Nivi farm House - sivakasi</Text>
                    </View>
                    <View style={styles.itemWrapper}>
                        <Image style={styles.image} source={require('../../assets/carrot.jpg')} />
                        <Text style={styles.itemText}>Carrot</Text>
                        <Text style={styles.price}>1kg ₹50/-</Text>
                        <Text>Munis farm House - Ooty</Text>
                    </View>
                    <View style={styles.itemWrapper}>
                        <Image style={styles.image} source={require('../../assets/egg.jpg')} />
                        <Text style={styles.itemText}>Egg</Text>
                        <Text style={styles.price}>10 Pcs ₹80/-</Text>
                        <Text>Nivi farm House - sivakasi</Text>
                    </View>
                    <View style={styles.itemWrapper}>
                        <Image style={styles.image} source={require('../../assets/mangos.jpg')} />
                        <Text style={styles.itemText}>Mango</Text>
                        <Text style={styles.price}>1kg ₹80/-</Text>
                        <Text>Nivi farm House - sivakasi</Text>
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 10
    },
    itemText: {
        fontSize: 13,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'left'
    },
    price: {
        marginVertical: 10,
        fontSize: 15,
        width: '100%',
        textAlign: 'left',
        fontWeight: 'bold'
    },
    banner: {
        width: '100%',
        height: 170,
        resizeMode: 'cover'
    },
    itemWrapper: {
        width: 'auto',
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#EAF4E8',
        margin: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    quote: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#29660C'
    },
    categoryText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 20,
        paddingLeft: 10
    },
    catgIconWrapper: {
        margin: 6,
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#EAF4E8',
        width: 90,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 12
    },
    catgIcon: {
        width: 70,
        height: 70,
    },
    avatar: {
        width: 40,
        height: 40
    },
    search: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        margin: 10,
    }
})