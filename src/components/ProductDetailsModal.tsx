import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
  Animated,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductReviews from './ProductReviews';
import { useCart } from '../context/CartContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';

interface ProductDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  productId?: string;
  productData?: StockItem | null;
}

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface StockItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  tags: string[];
  description?: string;
  rating?: number;
  reviews?: Review[];
  benefits?: string[];
  nutrition?: {
    [key: string]: string;
  };
  origin?: string;
  storageInfo?: string;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  onClose,
  productId,
  productData
}) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<StockItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const { dispatch } = useCart();
  // Animation values
  const [quantityAnim] = useState(new Animated.Value(1));
  const [addToCartScale] = useState(new Animated.Value(1));
  const user = useSelector((state: RootState) => state.auth.user)
  const navigation = useNavigation()
  useEffect(() => {
    if (productData) {
      setProduct(productData);
    } else if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId, productData]);

  const fetchProductDetails = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/products/${id}`);
      // const data = await response.json();
      // setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${product?.productName} - ${product?.description}\nPrice: ₹${product?.price}/${product?.unit}`,
        title: product?.productName,
        url: product?.image // Only works on iOS
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share product');
    }
  };

  const animateQuantity = (increase: boolean) => {
    Animated.sequence([
      Animated.timing(quantityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(quantityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (increase) {
      quantity < (product?.quantity || 0) && setQuantity(q => q + 1);
    } else {
      quantity > 1 && setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.quantity < quantity) {
      Alert.alert('Out of Stock', 'Selected quantity is not available');
      return;
    }

    Animated.sequence([
      Animated.timing(addToCartScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addToCartScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product._id,
        productName: product.productName,
        price: product.price,
        quantity,
        unit: product.unit,
        image: product.image,
      },
    });

    Alert.alert('Success', `Added ${quantity} ${product.productName} to cart`);
    onClose();
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? '#FFB800' : '#666'}
          />
        ))}
      </View>
    );
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#00A41C" />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.shareButton} onPress={() => { onClose(); navigation.navigate('ChatScreen', { selectedUser: { userName: product.farmName, _id: product.userId }, currentUser: user }) }}>
                    <Icon name="chat" size={24} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Icon name="share-variant" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <Image source={{ uri: `http://192.168.14.130:5000/${product.image}` }} style={styles.productImage} />

              <View style={styles.contentContainer}>
                <View style={styles.basicInfo}>
                  <Text style={styles.productName}>{product.productName}</Text>
                  <Text style={styles.category}>{product.category}</Text>

                  {product.rating && (
                    <TouchableOpacity
                      style={styles.ratingRow}
                      onPress={() => setShowReviews(!showReviews)}
                    >
                      {renderRatingStars(product.rating)}
                      <Text style={styles.reviews}>
                        ({product.reviews?.length || 0} reviews)
                      </Text>
                      <Icon
                        name={showReviews ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#666"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                  )}

                  {showReviews && product.reviews && (
                    <ProductReviews reviews={product.reviews} />
                  )}

                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{product.price}/{product.unit}</Text>
                    <Animated.View
                      style={[
                        styles.quantitySelector,
                        { transform: [{ scale: quantityAnim }] }
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => animateQuantity(false)}
                        style={styles.quantityButton}
                      >
                        <Icon name="minus" size={20} color="#00A41C" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() => animateQuantity(true)}
                        style={styles.quantityButton}
                      >
                        <Icon name="plus" size={20} color="#00A41C" />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>

                <View style={styles.divider} />

                {product.description && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>
                  </View>
                )}

                {product.benefits && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Benefits</Text>
                    {product.benefits?.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Icon name="check-circle" size={16} color="#00A41C" />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {product.nutrition && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nutrition Info</Text>
                    {Object.entries(product.nutrition)?.map(([key, value]) => (
                      <View key={key} style={styles.nutritionItem}>
                        <Text style={styles.nutritionKey}>{key}</Text>
                        <Text style={styles.nutritionValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {product.origin && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Origin</Text>
                    <Text style={styles.originText}>{product.origin}</Text>
                  </View>
                )}

                {product.storageInfo && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Storage Information</Text>
                    <Text style={styles.storageText}>{product.storageInfo}</Text>
                  </View>
                )}

                <View style={styles.tagsContainer}>
                  {product.tags?.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.footer}>
            <View style={styles.stockInfo}>
              <Icon
                name={product.quantity > 10 ? "check-circle" : "alert-circle"}
                size={20}
                color={product.quantity > 10 ? "#00A41C" : "#F44336"}
              />
              <Text style={[
                styles.stockText,
                { color: product.quantity > 10 ? "#00A41C" : "#F44336" }
              ]}>
                {product.quantity > 10 ? "In Stock" : "Low Stock"}
              </Text>
            </View>
            <Animated.View style={{ transform: [{ scale: addToCartScale }] }}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Icon name="cart" size={20} color="#fff" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  basicInfo: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#282c3f',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#282c3f',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  nutritionKey: {
    fontSize: 14,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#282c3f',
    fontWeight: '500',
  },
  originText: {
    fontSize: 14,
    color: '#666',
  },
  storageText: {
    fontSize: 14,
    color: '#666',
  },
  tagsContainer: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00A41C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailsModal; 