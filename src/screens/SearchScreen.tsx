import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, SafeAreaView, Image, Modal, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Slider from '@react-native-community/slider'
import ProductDetailsModal from '../components/ProductDetailsModal'

interface StockItem {
  id: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  tags: string[];
  description: string;
  rating: number;
  reviews: {
    id: string;
    userName: string;
    userImage?: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
  }[];
  benefits: string[];
  nutrition: Record<string, string>;
  origin: string;
  storageInfo: string;
}

// Dummy data
const STOCK_ITEMS: StockItem[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 40,
    quantity: 500,
    image: 'https://img.freepik.com/free-photo/tomatoes_144627-15413.jpg',
    unit: 'kg',
    tags: ['fresh', 'organic', 'vegetables'],
    description: 'Fresh, ripe tomatoes sourced directly from local farmers. Perfect for salads, cooking, and garnishing.',
    rating: 4.5,
    reviews: [
      {
        id: '1',
        userName: 'Rahul Kumar',
        rating: 5,
        date: '2024-03-15',
        comment: 'Very fresh and juicy tomatoes. Perfect for my daily cooking needs.',
        helpful: 12
      },
      {
        id: '2',
        userName: 'Priya Singh',
        userImage: 'https://randomuser.me/api/portraits/women/1.jpg',
        rating: 4,
        date: '2024-03-14',
        comment: 'Good quality but some were slightly overripe. Overall satisfied with the purchase.',
        helpful: 8
      },
      {
        id: '3',
        userName: 'Amit Patel',
        rating: 5,
        date: '2024-03-13',
        comment: 'Best tomatoes I\'ve bought in a while. Will definitely order again!',
        helpful: 15
      }
    ],
    benefits: [
      'Rich in antioxidants',
      'High in Vitamin C',
      'Good source of potassium',
      'Supports heart health'
    ],
    nutrition: {
      'Calories': '18 kcal/100g',
      'Carbohydrates': '3.9g',
      'Protein': '0.9g',
      'Vitamin C': '14% DV',
      'Potassium': '237mg'
    },
    origin: 'Local Farms, Tamil Nadu',
    storageInfo: 'Store in a cool, dry place. Refrigerate after cutting.'
  },
  {
    id: '2',
    name: 'Organic Potatoes',
    category: 'Vegetables',
    price: 30,
    quantity: 1000,
    image: 'https://img.freepik.com/free-photo/potatoes_144627-15413.jpg',
    unit: 'kg',
    tags: ['fresh', 'organic', 'vegetables'],
    description: 'Premium organic potatoes perfect for boiling, frying, or roasting. Grown without pesticides.',
    rating: 4.2,
    reviews: [
      {
        id: '1',
        userName: 'Deepak Sharma',
        userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        rating: 4,
        date: '2024-03-15',
        comment: 'Good quality potatoes, clean and well-sized.',
        helpful: 10
      },
      {
        id: '2',
        userName: 'Meera Reddy',
        rating: 5,
        date: '2024-03-14',
        comment: 'Perfect for making crispy fries. No bad ones in the batch.',
        helpful: 7
      },
      {
        id: '3',
        userName: 'Rajesh Kumar',
        rating: 4,
        date: '2024-03-12',
        comment: 'Fresh and organic as advertised. Would buy again.',
        helpful: 5
      }
    ],
    benefits: [
      'High in fiber',
      'Good source of vitamin B6',
      'Rich in potassium',
      'Contains antioxidants'
    ],
    nutrition: {
      'Calories': '77 kcal/100g',
      'Carbohydrates': '17g',
      'Protein': '2g',
      'Fiber': '2.2g',
      'Potassium': '421mg'
    },
    origin: 'Organic Farms, Karnataka',
    storageInfo: 'Store in a cool, dark place. Avoid refrigeration.'
  },
  // Add more items as needed
]

const categories = [
  { id: 'all', name: 'All Items', icon: 'view-grid' },
  { id: 'vegetable', name: 'Vegetables', icon: 'carrot' },
  { id: 'fruits', name: 'Fruits', icon: 'fruit-cherries' },
  { id: 'grains', name: 'Grains', icon: 'grain' },
  { id: 'dairy', name: 'Dairy', icon: 'cup' },
]

const sortOptions = [
  { id: 'name_asc', label: 'Name (A-Z)' },
  { id: 'name_desc', label: 'Name (Z-A)' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'quantity_low', label: 'Stock: Low to High' },
  { id: 'quantity_high', label: 'Stock: High to Low' },
  { id: 'distance_low', label: 'Distance: Low to High' },
  { id: 'distance_high', label: 'Distance: High to Low' },
]

const allTags = ['fresh', 'organic', 'vegetables', 'fruits', 'dairy', 'grains']

const SearchScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showSortModal, setShowSortModal] = useState(false)
  const [selectedSort, setSelectedSort] = useState('name_asc')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [stockFilter, setStockFilter] = useState('all')
  const [isGridView, setIsGridView] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log(route.params)
    if (route?.params?.category) {
      setSelectedCategory(route.params.category)
    }
  }, [])  

  const filterItems = (items: StockItem[]) => {
    return items
      .filter(item => {
        const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' ||
          item.category.toLowerCase() === selectedCategory.toLowerCase()
        const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max
        const matchesStock = stockFilter === 'all' ||
          (stockFilter === 'in_stock' && item.quantity > 10) ||
          (stockFilter === 'low_stock' && item.quantity <= 10)
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.some(tag => item.tags.includes(tag))

        return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesTags
      })
      .sort((a, b) => {
        switch (selectedSort) {
          case 'name_asc': return a.productName.localeCompare(b.productName)
          case 'name_desc': return b.productName.localeCompare(a.productName)
          case 'price_low': return a.price - b.price
          case 'price_high': return b.price - a.price
          case 'quantity_low': return a.quantity - b.quantity
          case 'quantity_high': return b.quantity - a.quantity
          case 'distance_low': return a.price - b.price
          case 'distance_high': return b.price - a.price
          default: return 0
        }
      })
  }

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (searchQuery) params.append('productName', searchQuery)
        if (selectedCategory !== 'all') params.append('category', selectedCategory)
        if (selectedTags.length) params.append('tags', selectedTags.join(','))
        if (stockFilter !== 'all') params.append('quantity', stockFilter === 'low_stock' ? '0-10' : '11-10000')
        if (priceRange.min || priceRange.max !== 1000) {
          params.append('priceMin', String(priceRange.min))
          params.append('priceMax', String(priceRange.max))
        }

        params.append('sortBy', selectedSort.startsWith('price') ? 'price' :
          selectedSort.startsWith('quantity') ? 'quantity' : 'productName')

        params.append('sortOrder', selectedSort.endsWith('_asc') || selectedSort.endsWith('low') ? 'asc' : 'desc')
        params.append('page', '1')
        params.append('limit', '50')

        const response = await fetch(`http://192.168.14.130:5000/stock?${params.toString()}`)
        const data = await response.json()
        console.log("data", data)
        if (response.ok) {
          setStockItems(data.stocks)
        } else {
          setError(data?.error || 'Something went wrong')
        }
      } catch (err: any) {
        setError(err.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [searchQuery, selectedCategory, selectedSort, stockFilter, priceRange, selectedTags])


  const renderStockItem = ({ item }: { item: StockItem }) => (
    <TouchableOpacity
      style={[styles.stockCard, !isGridView && styles.stockCardList]}
      onPress={() => setSelectedItem(item)}
    >
      <Image
        source={{ uri: `http://192.168.14.130:5000/${item.image}` }}
        style={[styles.stockImage, !isGridView && styles.stockImageList]}
      />
      {item.quantity <= 10 && (
        <View style={styles.lowStockBadge}>
          <Text style={styles.lowStockText}>Low Stock</Text>
        </View>
      )}
      <View style={[styles.stockInfo, !isGridView && styles.stockInfoList]}>
        <Text style={styles.stockName} numberOfLines={2}>{item.productName}</Text>
        <Text style={styles.stockCategory}>{item.category}</Text>
        <View style={styles.stockDetails}>
          <Text style={styles.stockPrice}>₹{item.price}/{item.unit}</Text>
          <Text style={styles.stockQuantity}>Stock: {item.quantity}</Text>
        </View>
        {!isGridView && (
          <View style={styles.tagContainer}>
            {item?.tags?.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const handlePriceRangeChange = (value: number) => {
    setPriceRange({ ...priceRange, max: Math.round(value) })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-variant" size={24} color="#00A41C" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewToggleButton}
          onPress={() => setIsGridView(!isGridView)}
        >
          <Icon
            name={isGridView ? "view-list" : "view-grid"}
            size={24}
            color="#00A41C"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Icon
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? '#00A41C' : '#666'}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortModal(true)}
          >
            <Icon name="sort-variant" size={20} color="#666" />
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>

          <View style={styles.priceRangeContainer}>
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.priceRangeValues}>
              <Text>₹{priceRange.min}</Text>
              <Text>₹{priceRange.max}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1000}
              value={priceRange.max}
              onValueChange={(value) => setPriceRange(prev => ({ ...prev, max: Math.round(value) }))}
              minimumTrackTintColor="#00A41C"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#00A41C"
            />
          </View>

         

          <View style={styles.stockFilterButtons}>
            {['all', 'in_stock', 'low_stock'].map(filter => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.stockFilterButton,
                  stockFilter === filter && styles.stockFilterButtonActive
                ]}
                onPress={() => setStockFilter(filter)}
              >
                <Text style={[
                  styles.stockFilterText,
                  stockFilter === filter && styles.stockFilterTextActive
                ]}>
                  {filter === 'all' ? 'All' :
                    filter === 'in_stock' ? 'In Stock' : 'Low Stock'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={filterItems(stockItems)}
        renderItem={renderStockItem}
        keyExtractor={item => item.id}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        contentContainerStyle={styles.stockList}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  selectedSort === option.id && styles.sortOptionActive
                ]}
                onPress={() => {
                  setSelectedSort(option.id)
                  setShowSortModal(false)
                }}
              >
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option.id && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <Icon name="check" size={20} color="#00A41C" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <ProductDetailsModal
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        productData={selectedItem}
      />
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#282c3f',
    paddingVertical: 8,
  },
  filterButton: {
    padding: 8,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#00A41C',
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  sortButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  stockFilterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockFilterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  stockFilterButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  stockFilterText: {
    fontSize: 14,
    color: '#666',
  },
  stockFilterTextActive: {
    color: '#00A41C',
  },
  stockList: {
    padding: 8,
  },
  stockCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stockImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lowStockText: {
    fontSize: 12,
    color: '#F44336',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortOptionActive: {
    backgroundColor: '#E8F5E9',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#282c3f',
  },
  sortOptionTextActive: {
    color: '#00A41C',
    fontWeight: '600',
  },
  viewToggleButton: {
    padding: 8,
    marginLeft: 8,
  },
  stockCardList: {
    flexDirection: 'row',
    flex: 1,
    margin: 8,
    height: 120,
  },
  stockImageList: {
    width: 120,
    height: '100%',
  },
  stockInfoList: {
    flex: 1,
    padding: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    color: '#00A41C',
    fontSize: 12,
  },
  priceRangeContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 8,
  },
  priceRangeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  tagsScrollView: {
    marginBottom: 16,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  tagButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  tagButtonText: {
    color: '#666',
    fontSize: 14,
  },
  tagButtonTextActive: {
    color: '#00A41C',
  },
  detailsModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  detailsImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContent: {
    padding: 16,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#282c3f',
    marginBottom: 8,
  },
  detailsCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  detailsPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#282c3f',
  },
  detailsStock: {
    fontSize: 16,
    color: '#666',
  },
})