import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const colors = {
  bg: '#f5f5f5',
  card: '#ffffff',
  primary: '#7ed321',
  text: '#1a1a1a',
  subText: '#6c757d',
  border: '#e0e0e0',
};

export default function SalesAnalyticsScreen() {
  const [data, setData] = useState<{
    totalSales: number,
    salesByDay: { labels: string[], values: number[] },
    orderStatus: { label: string, count: number, color: string }[]
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const encodedFarmName = encodeURIComponent(user?.farmName || '');
    const url = `http://192.168.14.130:5000/orders/analytics/${encodedFarmName}`;
    axios.get(url)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} />;

  if (!data) return <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available.</Text>;

  const { totalSales, salesByDay, orderStatus } = data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Sales Analytics</Text>

        {/* Total Sales Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Sales</Text>
          <Text style={styles.totalValue}>₹{totalSales.toFixed(2)}</Text>
        </View>

        {/* Order Status */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statusContainer}>
          {orderStatus.map(status => (
            <View key={status.label} style={[styles.statusBox, { backgroundColor: `${status.color}20`, borderColor: status.color }]}>
              <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
              <Text style={[styles.statusCount, { color: status.color }]}>{status.count}</Text>
            </View>
          ))}
        </View>

        {/* Sales by Day */}
        <Text style={styles.sectionTitle}>Sales This Week</Text>
        {salesByDay.labels.map((day, idx) => (
          <View key={day} style={styles.dayCard}>
            <Text style={styles.dayLabel}>{day}</Text>
            <Text style={styles.dayValue}>₹{salesByDay.values[idx].toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 20, marginBottom: 8 },
  totalCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, color: colors.subText },
  totalValue: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginTop: 4 },

  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusBox: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    minWidth: 80,
    marginRight: 12,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },

  dayCard: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderColor: colors.border,
    borderWidth: 1,
  },
  dayLabel: { fontSize: 16, color: colors.text },
  dayValue: { fontSize: 16, color: colors.primary, fontWeight: '600' },
});
