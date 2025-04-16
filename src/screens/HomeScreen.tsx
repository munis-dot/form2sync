import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProductDetailsModal from '../components/ProductDetailsModal';

interface StockItem {
    id: string;
    name: string;
    category: string;
    price: string;
    quantity: number;
    image: string;
    productName: string;
}

const HomeScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [selectedItem, setSelectedItem] = useState();
    const [stockData, setStockData] = useState<StockItem[]>([])

    const stockList = () => {
        axios.get(`http://192.168.14.130:5000/stock?limit=10000&productName=${searchQuery}`)
            .then(res => {
                console.log(res.data.stocks)
                setStockData(res.data.stocks)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        stockList()
    }, [searchQuery])
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            <View style={styles.header}>
                <Text style={styles.quote}>Happy Farming</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: '10' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                        <Ionicons name='notifications-outline' size={30} />
                    </TouchableOpacity>
                    <TouchableHighlight onPress={() => navigation.navigate('profileScreen')}>
                        <Image style={styles.avatar} source={{ uri: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740' }} />
                    </TouchableHighlight>
                </View>
            </View>
            <TouchableHighlight onPress={() => navigation.navigate('searchScreen')}>
                <TextInput onChangeText={text => setSearchQuery(text)} placeholder='🔍 search' style={styles.search} />
            </TouchableHighlight>
            <ScrollView>
                <Image style={styles.banner} source={require('../../assets/banner2.png')} />
                <Text style={styles.categoryText}>Popular Categories</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('searchScreen', { category: 'vegetable' })}>
                        <View style={{ alignItems: 'center', marginLeft: 5, justifyContent: 'center' }}>
                            <View style={styles.catgIconWrapper}>
                                <Image style={styles.catgIcon} source={require('../../assets/tomoto.png')} />
                            </View>
                            <Text style={styles.itemText}>Vegetables</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('searchScreen', { category: 'fruits' })}>

                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.catgIconWrapper}>
                                <Image style={styles.catgIcon} source={require('../../assets/mango.png')} />
                            </View>
                            <Text style={styles.itemText}>Fruits</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('searchScreen', { category: 'dairy' })}>

                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.catgIconWrapper}>
                                <Image style={styles.catgIcon} source={require('../../assets/egg.png')} />
                            </View>
                            <Text style={styles.itemText}>Eggs and milk</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('searchScreen', { category: 'grains' })}>

                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.catgIconWrapper}>
                                <Image style={styles.catgIcon} source={require('../../assets/nuts.png')} />
                            </View>
                            <Text style={styles.itemText}>Nuts</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.categoryText}>You Likes</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    {
                        stockData.map(item => {
                            return (
                                <TouchableOpacity onPress={() => setSelectedItem(item)}>
                                    <View style={styles.itemWrapper}>
                                        <Image style={styles.image} source={{ uri: `http://192.168.14.130:5000/${item.image}` }} />
                                        <Text style={styles.itemText}>{item.productName}</Text>
                                        <Text style={styles.price}>₹ {item.price}</Text>
                                        <Text style={styles.itemText}>{item.farmName}</Text>
                                    </View>
                                </TouchableOpacity>

                            )
                        })
                    }

                </View>
            </ScrollView>
            <ProductDetailsModal
                visible={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                productData={selectedItem}
            />
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