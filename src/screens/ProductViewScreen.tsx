import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductViewScreen = ({ route }: any) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    navigation.navigate('Cart', { cartItem });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₹ {product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => quantity > 1 && setQuantity(quantity - 1)} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
        <Text style={styles.cartBtnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductViewScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fefefe',
      padding: 16,
    },
    image: {
      width: '100%',
      height: 240,
      borderRadius: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 8,
    },
    price: {
      fontSize: 18,
      fontWeight: '600',
      color: '#00c853',
      marginBottom: 8,
    },
    desc: {
      fontSize: 14,
      color: '#555',
      marginBottom: 16,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    qtyBtn: {
      padding: 10,
      backgroundColor: '#eee',
      borderRadius: 8,
    },
    qtyText: {
      fontSize: 20,
      fontWeight: '700',
    },
    qty: {
      fontSize: 18,
      marginHorizontal: 16,
    },
    cartBtn: {
      backgroundColor: '#00c853',
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    cartBtnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    header: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 20,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      elevation: 2,
    },
    info: {
      marginLeft: 12,
      flex: 1,
      justifyContent: 'space-around',
    },
    footer: {
      borderTopWidth: 1,
      borderColor: '#ddd',
      paddingTop: 16,
    },
    totalText: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    checkoutBtn: {
      backgroundColor: '#00c853',
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    checkoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  