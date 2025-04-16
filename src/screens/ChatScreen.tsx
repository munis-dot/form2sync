// screens/ChatScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { io } from 'socket.io-client';
import axios from 'axios';

const colors = {
    primary: '#6bb700',
    bg: '#fff',
    text: '#1a1a1a',
    muted: '#6c757d',
    messageBg: '#f1f3f5',
    myMessageBg: '#d4edda',
};

const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const { currentUser, selectedUser } = route.params;
    console.log(currentUser, selectedUser)
    const flatListRef = useRef(null);

    useEffect(() => {
        axios.post('http://192.168.14.130:5000/chat/updateChat', { from: currentUser._id, to: selectedUser._id })
            .then(res => console.log(res))
            .catch(err => console.log(err))
        axios.post('http://192.168.14.130:5000/chat/updateChat', { from: selectedUser._id, to: currentUser._id })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }, [])

    const getMessages = () => {
        axios
            .get(`http://192.168.14.130:5000/chat/msg/${selectedUser._id}`, {
                params: { userId: currentUser._id },
            })
            .then(res => setMessages(res.data))
            .catch(err => console.error(err));
    }

    useEffect(() => {

        getMessages()

    }, [selectedUser]);

    const sendMessage = () => {
        if (!content.trim()) return;

        const messageData = {
            senderId: currentUser._id,
            recipientId: selectedUser._id,
            content,
            timestamp: new Date(),
        };
        console.log("first",messageData)
        axios.post('http://192.168.14.130:5000/chat/sendMessage', messageData)
            .then(res => {
                console.log(res)
                setMessages(prev => [...prev, messageData]);
                setContent('');
                flatListRef.current?.scrollToEnd({ animated: true });
            })
            .catch(err => console.error(err));

        
    };

    useEffect(() => {
        setTimeout(() => {
            getMessages()
        }, [30000])
    }, [])

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageBubble,
                item.senderId === currentUser._id ? styles.myMessage : styles.otherMessage,
            ]}
        >
            <Text style={styles.messageText}>{item.content}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <Text style={styles.chatTitle}>Chat with {selectedUser.userName}</Text>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.chatContainer}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Type a message..."
                    value={content}
                    onChangeText={setContent}
                    style={styles.input}
                    placeholderTextColor={colors.muted}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Icon name="send" size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        padding: 16,
    },
    chatContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 18,
        marginBottom: 10,
    },
    myMessage: {
        backgroundColor: colors.myMessageBg,
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: colors.messageBg,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sendButton: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 100,
    },
});
