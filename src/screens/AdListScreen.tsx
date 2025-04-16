import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Ionicons from 'react-native-vector-icons/Ionicons'


const AdListScreen = ({ navigation }) => {
    const [ads, setAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [search, setSearch] = useState('');
    const user = useSelector((state: RootState) => state.auth.user)

    const fetchAds = async () => {
        try {
            const response = await axios.get('http://192.168.14.130:5000/ad');
            setAds(response.data);
            setFilteredAds(response.data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    const handleDelete = async (adId) => {
        Alert.alert('Delete Ad', 'Are you sure?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        await axios.delete(`http://192.168.14.130:5000/ad/${adId}`);
                        fetchAds(); // refresh after delete
                    } catch (err) {
                        console.error('Delete failed:', err);
                    }
                },
            },
        ]);
    };

    useEffect(() => {
        fetchAds();
    }, []);

    useEffect(() => {
        const filtered = ads.filter((ad) =>
            ad.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredAds(filtered);
    }, [search, ads]);

    const renderAdCard = ({ item }) => {
        const isUserAd = item.postedBy === user._id;

        return (
            <View style={styles.card}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.content}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{item.title}</Text>
                        {isUserAd && <Text style={styles.tag}>Your Ad</Text>}
                    </View>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
                {isUserAd && (
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(item._id)}
                    >
                        <Text style={styles.deleteText}>🗑️</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Explore Ads</Text>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('addPostScreen')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
            <TextInput
                placeholder="Search ads..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchBox}
            />
            <FlatList
                data={filteredAds}
                keyExtractor={(item) => item._id}
                renderItem={renderAdCard}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default AdListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#00c853',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 100,
    },

    header: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    searchBox: {
        backgroundColor: '#f1f3f6',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 60,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    tag: {
        fontSize: 12,
        color: '#0aaf4d',
        backgroundColor: '#e0ffe8',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    description: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
    deleteBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ffebeb',
        borderRadius: 20,
        padding: 6,
    },
    deleteText: {
        fontSize: 16,
        color: '#ff3b30',
    },
});
