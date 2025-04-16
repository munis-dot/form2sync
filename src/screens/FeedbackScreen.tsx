import axios from 'axios';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
} from 'react-native';

const emojis = [
    { label: '😡', value: 'Very Bad' },
    { label: '😞', value: 'Bad' },
    { label: '😐', value: 'Okay' },
    { label: '😊', value: 'Good' },
    { label: '😍', value: 'Excellent' },
];

const FeedbackScreen = ({ route, navigation }) => {
    const [selected, setSelected] = useState('');
    const [comments, setComments] = useState('');
    const { from, to, userId } = route.params;
    const handleSubmit = () => {
        if (!selected && !comments.trim()) {
            Alert.alert('Please give feedback');
            return;
        }
        try {
            axios.post(`http://192.168.14.130:5000/feedback`, { userId: userId, userName: from, recieverId: to, message: comments, rating: selected })
                .then(res => {
                    Alert.alert('Feedback added Successfully')
                    navigation.navigate('orderManagementScreen')
                    setSelected('');
                    setComments('');
                })
                .catch(err => {
                    console.log(err)
                })
        }
        catch (error) {
            console.log(error)
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rate Your Experience</Text>

            <View style={styles.emojiContainer}>
                {emojis.map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        style={[
                            styles.emojiButton,
                            selected === item.value && styles.emojiSelected,
                        ]}
                        onPress={() => setSelected(item.value)}
                    >
                        <Text style={styles.emoji}>{item.label}</Text>
                        <Text
                            style={[
                                styles.emojiLabel,
                                selected === item.value && styles.labelSelected,
                            ]}
                        >
                            {item.value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.textInput}
                placeholder="Additional comments..."
                placeholderTextColor="#999"
                multiline
                value={comments}
                onChangeText={setComments}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Feedback</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FeedbackScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        marginBottom: 24,
        textAlign: 'center',
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    emojiButton: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 12,
        width: 60,
    },
    emoji: {
        fontSize: 28,
    },
    emojiLabel: {
        fontSize: 12,
        marginTop: 4,
        color: '#555',
    },
    emojiSelected: {
        backgroundColor: '#E0F7E9',
    },
    labelSelected: {
        color: '#2E7D32',
        fontWeight: '600',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#222',
        height: 120,
        textAlignVertical: 'top',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 24,
    },
    submitButton: {
        backgroundColor: '#00C853',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
