import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user)

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`http://192.168.14.130:5000/notifications/${user._id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Icon
                name={item.type === 'order' ? 'cart-outline' : item.type === 'info' ? 'alert-circle-outline' : 'bell-outline'}
                size={24}
                color="#52c41a"
                style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#52c41a" />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
        color: '#000',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    message: {
        fontSize: 16,
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});
