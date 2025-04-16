import React from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface ProductReviewsProps {
  reviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          {item.userImage ? (
            <Image source={{ uri: item.userImage }} style={styles.userImage} />
          ) : (
            <View style={styles.userInitial}>
              <Text style={styles.userInitialText}>
                {item.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              name={star <= item.rating ? 'star' : 'star-outline'}
              size={14}
              color={star <= item.rating ? '#FFB800' : '#666'}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{item.comment}</Text>
      <View style={styles.helpfulContainer}>
        <Icon name="thumb-up-outline" size={14} color="#666" />
        <Text style={styles.helpfulText}>{item.helpful} found this helpful</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewContainer: {
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitialText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00A41C',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#282c3f',
    lineHeight: 20,
    marginBottom: 12,
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default ProductReviews; 