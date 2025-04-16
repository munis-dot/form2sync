import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface StockItem {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
  image: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const categories: Category[] = [
  { id: '1', name: 'All Items', icon: 'view-grid' },
  { id: '2', name: 'Low Stock', icon: 'alert-circle-outline' },
  { id: '3', name: 'Out of Stock', icon: 'close-circle-outline' },
]

const StockManagementScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('1');

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

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon
        name={item.icon}
        size={24}
        color={selectedCategory === item.id ? '#00A41C' : '#666'}
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )
  console.log(selectedCategory)
  const renderStockItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.stockItem}>
        <View style={styles.stockImageContainer}>
          <Image
            source={{ uri: `http://192.168.14.130:5000/${item.image}` }}
            style={styles.stockImage}
          />
          {(item.quantity < 6 && item.quantity > 0) && (
            <View style={styles.stockStatus}>
              <Text style={styles.stockStatusText}>Low Stock</Text>
            </View>
          )}
          {(item.quantity === 0) && (
            <View style={styles.stockStatus}>
              <Text style={styles.stockStatusText}>Low Stock</Text>
            </View>
          )}
        </View>
        <View style={styles.stockInfo}>
          <Text style={styles.stockName} numberOfLines={2}>{item.productName}</Text>
          <Text style={styles.stockCategory}>{item.category}</Text>
          <View style={styles.stockDetails}>
            <Text style={styles.stockPrice}>₹ {item.price}</Text>
            <Text style={styles.stockQuantity}>Qty: {item.quantity}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('StockAddScreen', { stock: item })}>
          <Icon name="pencil" size={20} color="#00A41C" />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stock Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('StockAddScreen')}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={stockData.filter(item => {
          if (selectedCategory === '2') {
            return item.quantity < 6 && item.quantity > 0
          }
          else if (selectedCategory === '3') {
            return item.quantity === 0
          }
          else {
            return true
          }
        })}
        renderItem={renderStockItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stockList}
      />
    </SafeAreaView>
  )
}

export default StockManagementScreen

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
  addButton: {
    backgroundColor: '#00A41C',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#282c3f',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#E8F5E9',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#00A41C',
  },
  stockList: {
    padding: 8,
  },
  stockItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
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
  stockImageContainer: {
    position: 'relative',
  },
  stockImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  stockStatus: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockStatusText: {
    color: '#FF4444',
    fontSize: 12,
    fontWeight: '500',
  },
  stockInfo: {
    padding: 12,
  },
  stockName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 4,
  },
  stockCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#282c3f',
  },
  stockQuantity: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
})