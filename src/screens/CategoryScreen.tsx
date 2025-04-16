import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const categories = [
  { name: 'Vegetables', emoji: '🥦', key: 'vegetable' },
  { name: 'Fruits', emoji: '🍎', key: 'fruit' },
  { name: 'Dairy', emoji: '🥛', key: 'dairy' },
  { name: 'Grains', emoji: '🌾', key: 'grains' },
  { name: 'Pulses', emoji: '🥬', key: 'pulses' },
  { name: 'Spices', emoji: '🌶️', key: 'spices' },
  { name: 'Beverages', emoji: '🧃', key: 'beverages' },
];

const CategoryScreen = ({ navigation }) => {
  const handlePress = (categoryKey: string) => {
    navigation.navigate('searchScreen', { category: categoryKey });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.key)}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Farm Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.key}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CategoryScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      paddingHorizontal: 16,
      paddingTop: 24,
    },
    header: {
      fontSize: 26,
      fontWeight: '700',
      color: '#222',
      marginBottom: 20,
    },
    listContainer: {
      paddingBottom: 20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '48%',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    emoji: {
      fontSize: 32,
      marginBottom: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: '#444',
    },
  });
  