// app/(public)/reports.js
// شاشة البلاغات

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, ActivityIndicator, StatusBar, RefreshControl, Alert,
} from 'react-native';
import ENV from '../../config';

const ReportCard = ({ report }) => {
  const formattedDate = new Date(report.reported_at).toLocaleString();
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.description}>{report.description}</Text>
      <Text style={styles.title}>المصدر</Text>
      {report.message_type && <Text style={styles.sourceTxt}>{report.message_type}</Text>}
      {report.phone_number && <Text style={styles.sourceTxt}>{report.phone_number}</Text>}
      {report.email && <Text style={styles.sourceTxt}>{report.email}</Text>}
      <Text style={styles.userInfo}>{formattedDate}</Text>
      <Text style={styles.userInfo}>المستخدم: {report.user?.username || 'غير معروف'}</Text>
    </View>
  );
};

const LatestReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`${ENV.FASTAPI_URL}/get-reports`);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      const sortedReports = [...data].sort((a, b) =>
        new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
      );
      setReports(sortedReports);
    } catch {
      setError('فشل في تحميل البلاغات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchReports(); }, [fetchReports]);

  const handleAddReport = () => navigation.navigate('AddReport');

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}><Text style={styles.emptyText}>لا توجد بلاغات حالياً</Text></View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchReports}>
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#003D4D" /></View>
      ) : error ? renderError() : (
        <FlatList
          data={reports}
          renderItem={({ item }) => <ReportCard report={item} />}
          keyExtractor={(item) => item.report_id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#003D4D']} tintColor="#003D4D" />}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddReport} activeOpacity={0.7}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#D32F2F', fontSize: 16, marginBottom: 16, textAlign: 'center' },
  retryButton: { backgroundColor: '#003D4D', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: '#666', fontSize: 16, textAlign: 'center' },
  listContent: { padding: 16, flexGrow: 1 },
  card: { backgroundColor: '#F0F4F8', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  title: { fontWeight: 'bold', color: '#003D4D', fontSize: 16, marginBottom: 4, textAlign: 'right' },
  sourceTxt: { color: '#333', marginBottom: 6, textAlign: 'right' },
  description: { color: '#333', marginBottom: 8, textAlign: 'right', lineHeight: 20 },
  userInfo: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 2 },
  addButton: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#003D4D', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  addButtonText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
});

export default LatestReportsScreen;
