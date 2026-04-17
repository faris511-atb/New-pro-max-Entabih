// app/(public)/menu.js
// شاشة القائمة

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../context/AuthContext';

const App = () => <ProfileScreen />;

function ProfileScreen({ navigation }) {
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth?.signout) {
      await auth.signout();
      navigation.replace('MainTabs');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* رأس الصفحة */}
      <View style={styles.header}>
        <View style={styles.profilePicContainer}>
          <FontAwesome name="user-circle-o" size={100} color="#003D4D" />
        </View>
        <Text style={styles.username}>{auth?.user?.username || 'المستخدم'}</Text>
      </View>

      {/* خيارات القائمة */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('UserInfo')}>
          <Text style={styles.optionText}>المعلومات الشخصية</Text>
          <Ionicons name="person" size={24} color="#FFF" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>الإعدادات</Text>
          <Ionicons name="settings" size={24} color="#FFF" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.optionText}>رأيك عن التطبيق</Text>
          <MaterialIcons name="rate-review" size={24} color="#FFF" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('FAQ')}>
          <Text style={styles.optionText}>الأسئلة الشائعة</Text>
          <Ionicons name="help-circle" size={24} color="#FFF" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Text style={styles.optionText}>تسجيل خروج</Text>
          <MaterialIcons name="logout" size={24} color="#FFF" style={styles.optionIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  scrollContent: { paddingBottom: 30 },
  header: { alignItems: 'center', marginTop: 20 },
  profilePicContainer: { marginBottom: 10 },
  username: { fontSize: 18, fontWeight: '600', color: '#666' },
  optionsContainer: { marginTop: 20, marginHorizontal: 20 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#003D4D', padding: 15, borderRadius: 8, marginVertical: 5, justifyContent: 'space-between' },
  optionIcon: { marginLeft: 0 },
  optionText: { color: '#FFF', fontSize: 16, textAlign: 'right', flex: 1 },
});

export default App;
