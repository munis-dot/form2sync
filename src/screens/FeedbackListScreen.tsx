import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    SafeAreaView,
    Platform,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import { useSelector } from 'react-redux';
  import { RootState } from '../redux/store';
  
  interface Feedback {
    _id: string;
    userName: string;
    message: string;
    createdAt: string;
    rating: string;
  }
  
  const emojis = [
    { label: '😡', value: 'Very Bad', stars: 1 },
    { label: '😞', value: 'Bad', stars: 2 },
    { label: '😐', value: 'Okay', stars: 3 },
    { label: '😊', value: 'Good', stars: 4 },
    { label: '😍', value: 'Excellent', stars: 5 },
  ];
  
  const FeedbackListScreen = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);
  
    const getFeedbacks = async () => {
      try {
        console.log("first",user?._id)
        const res = await axios.get(`http://192.168.14.130:5000/feedback/${user?._id}`);
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err.message);
      }
    };
  
    useEffect(() => {
      getFeedbacks();
    }, []);
  
    const filteredFeedbacks = feedbacks.filter(fb =>
      fb.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const getEmojiData = (rating: string) => {
      return emojis.find(e => e.value.toLowerCase() === rating.toLowerCase());
    };
  
    const renderStars = (rating: string) => {
      const emojiData = getEmojiData(rating);
      const stars = emojiData?.stars || 0;
      return (
        <View style={{ flexDirection: 'row', marginTop: 6, gap: 4 }}>
          {[...Array(stars)].map((_, i) => (
            <Icon key={i} name="star" size={18} color="#FFD700" />
          ))}
        </View>
      );
    };
  
    const renderFeedbackItem = ({ item }: { item: Feedback }) => {
      const emojiData = getEmojiData(item.rating);
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <Text style={styles.emoji}>{emojiData?.label}</Text>
          </View>
  
          <Text style={styles.ratingText}>{emojiData?.value}</Text>
          {renderStars(item.rating)}
          <Text style={styles.message}>{item.message}</Text>
        </View>
      );
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Search feedback..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBox}
        />
        <FlatList
          data={filteredFeedbacks}
          keyExtractor={(item) => item._id}
          renderItem={renderFeedbackItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No feedback found.</Text>}
        />
      </SafeAreaView>
    );
  };
  
  export default FeedbackListScreen;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: '#f6f8fa',
    },
    searchBox: {
      backgroundColor: '#fff',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 14,
      fontSize: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: Platform.OS === 'android' ? 3 : 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#2196F3',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    date: {
      fontSize: 12,
      color: '#888',
    },
    emoji: {
      fontSize: 24,
      marginLeft: 'auto',
    },
    ratingText: {
      fontSize: 15,
      fontWeight: '500',
      marginTop: 6,
      color: '#444',
    },
    message: {
      fontSize: 15,
      color: '#555',
      marginTop: 10,
    },
    emptyText: {
      textAlign: 'center',
      color: '#999',
      fontSize: 16,
      marginTop: 40,
    },
  });
    