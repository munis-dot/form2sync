import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, Linking, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ModalView from './ModalView';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import WebViewScreen from './WebViewScreen';

interface NewsItem {
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  url: string;
}

const NewsScreen = ({ navigation }) => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        'https://newsapi.org/v2/everything?' +
        'q=agriculture+farming&' +
        'language=en&' +
        'sortBy=publishedAt&' +
        'apiKey=bfc4373b16d14533b66b932d0bc5423e' // Replace with your NewsAPI key
      )
      const data = await response.data;
      if (data.articles) {
        setNews(data.articles)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchNews()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => {
        // setSelectedNews(item)
        // setModalVisible(true)
        navigation.navigate('WebViewScreen', { url: item.url })
      }}
    >
      <Image
        source={{
          uri: item.urlToImage || 'https://via.placeholder.com/300x200?text=Agriculture+News'
        }}
        style={styles.newsImage}
      />
      <View style={styles.newsContent}>
        <View style={styles.sourceInfo}>
          <Text style={styles.sourceName}>{item.source.name}</Text>
          <Text style={styles.publishDate}>{formatDate(item.publishedAt)}</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.readMore}>
          <Text style={styles.readMoreText}>Read More</Text>
          <Icon name="chevron-right" size={20} color="#00A41C" />
        </View>
      </View>
    </TouchableOpacity>
  )
  console.log(selectedNews)
  return (
    <SafeAreaView style={styles.container}>

      {/* <WebView source={{ uri: 'https://www.artnews.com/art-news/reviews/amy-sherald-whitney-museum-exhibition-review-1234738510/' }} style={{ flex: 1 }} /> */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agriculture News</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={24} color="#00A41C" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.newsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00A41C"
            colors={['#00A41C']}
          />
        }
      />
    </SafeAreaView>
  )
}

export default NewsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282c3f',
  },
  refreshButton: {
    padding: 8,
  },
  newsList: {
    padding: 16,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 16,
  },
  sourceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 14,
    color: '#00A41C',
    fontWeight: '600',
  },
  publishDate: {
    fontSize: 12,
    color: '#666',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#282c3f',
    marginBottom: 8,
    lineHeight: 24,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#00A41C',
    fontWeight: '600',
    marginRight: 4,
  },
})