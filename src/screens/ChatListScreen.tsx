import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ChatListScreen = ({ navigation }) => {
    const [chatUsers, setChatUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    const fetchChatUsers = async () => {
        try {
            const url = `http://192.168.14.130:5000/chat/list/${user._id}`;
            const res = await axios.get(url);
            setChatUsers(res.data[0].chatList);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchChatUsers();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchChatUsers();
        setRefreshing(false);
    }, []);

    const openChat = (a) => {
        console.log(a,user)
        navigation.navigate('ChatScreen', { selectedUser: a, currentUser: user });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.userCard} onPress={() => openChat(item)}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {item.userName?.charAt(0)?.toUpperCase()}
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.lastMessage}>Tap to start chatting</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <FlatList
                data={chatUsers}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default ChatListScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        color: '#222',
    },
    listContent: {
        paddingBottom: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        marginBottom: 12,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        backgroundColor: '#E8F0FE',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3A5EFF',
    },
    textContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    lastMessage: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
});
