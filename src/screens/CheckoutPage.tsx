import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useCart } from '../context/CartContext';

interface Item {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Props {
    cartItems: Item[];
    userId: string;
    navigation: any;
}

const CheckoutScreen = ({ navigation }) => {
    const user = useSelector((state: RootState) => state.auth.user)
    const userId = user?._id;
    const { state, dispatch } = useCart();
    const cartItems = state.items;

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const placeOrder = async () => {
        try {
            const res = await axios.post('http://192.168.14.130:5000/orders', {
                userId,
                items: cartItems,
            });
            Alert.alert('Success', 'Order placed successfully!');
            navigation.navigate('orderManagementScreen');
        } catch (err) {
            console.log(err)
            Alert.alert('Error', 'Failed to place order');
        }
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={styles.itemCard}>
            <View>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={styles.bottomSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>₹{totalAmount}</Text>
                </View>
                <TouchableOpacity style={styles.placeOrderBtn} onPress={placeOrder}>
                    <Text style={styles.btnText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        color: '#111827',
    },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    itemQty: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10b981',
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#10b981',
    },
    placeOrderBtn: {
        backgroundColor: '#10b981',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
