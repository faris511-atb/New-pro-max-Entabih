// app/(public)/homescreen.js
// الشاشة الرئيسية - بدون expo-font

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Image,
  ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const SLIDE_WIDTH = width - 40;
const AUTO_SCROLL_INTERVAL = 5000;

const DotIndicator = React.memo(({ activeIndex, length }) => (
  <View style={styles.dotContainer}>
    {Array(length).fill(0).map((_, index) => (
      <View key={index} style={[styles.dot, { backgroundColor: index === activeIndex ? '#003D4D' : '#D9D9D9' }]} />
    ))}
  </View>
));

const AwarenessSlide = React.memo(({ title, text, icon, color }) => (
  <View style={[styles.slide, { backgroundColor: '#fff' }]}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Ionicons name={icon} size={36} color="#fff" />
    </View>
    <View style={styles.slideContent}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  </View>
));

const AdSlide = React.memo(({ image, title, description, link }) => (
  <TouchableOpacity style={[styles.adSlide, { width: SLIDE_WIDTH }]} activeOpacity={0.8} onPress={() => Linking.openURL(link)}>
    <Image source={image} style={styles.adImage} />
    <View style={styles.adOverlay}>
      <Text style={styles.adTitle}>{title}</Text>
      <Text style={styles.adDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
));

const FraudTypeItem = React.memo(({ title, icon, color }) => (
  <View style={styles.fraudTypeItem}>
    <Ionicons name={icon} size={20} color={color} style={styles.fraudTypeIcon} />
    <Text style={styles.fraudTypeText}>{title}</Text>
  </View>
));

const HomeScreen = () => {
  const [activeAwarenessIndex, setActiveAwarenessIndex] = useState(0);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const awarenessScrollRef = useRef(null);
  const adScrollRef = useRef(null);

  const awarenessContent = [
    { title: 'كن يقظًا!', text: 'لا تشارك معلوماتك الشخصية أو المصرفية مع أي شخص عبر الهاتف أو الرسائل النصية. البنوك لا تطلب كلمات المرور أو أرقام البطاقات كاملة.', icon: 'shield-checkmark', color: '#e74c3c' },
    { title: 'تحقق دائمًا!', text: 'تأكد من هوية المتصل أو مصدر الرسالة. اتصل بالرقم الرسمي للمؤسسة للتحقق قبل اتخاذ أي إجراء.', icon: 'search', color: '#f39c12' },
    { title: 'لا تتسرع!', text: 'رسائل الطوارئ التي تطلب تصرفًا فوريًا غالبًا ما تكون عمليات احتيال. خذ وقتك للتفكير والتحقق.', icon: 'time', color: '#27ae60' },
  ];

  const adContent = [
    { image: require('../../assets/images/Absher.png'), title: 'وقعت في مشكلة احتيال؟', description: 'خدماتي => الأمن العام => بلاغ احتيال', link: 'https://www.absher.sa' },
    { image: require('../../assets/images/SAMA.png'), title: 'البنك المركزي السعودي', description: 'في حال وقوعك ضحية احتيال ضد مؤسسة', link: 'https://www.sama.gov.sa/ar-sa/Pages/ServiceDetails.aspx?serviceId=99' },
  ];

  const fraudCategories = [
    { title: 'احتيال مصرفي عبر الهاتف أو الرسائل النصية', icon: 'card', color: '#3498db' },
    { title: 'رسائل مزيفة تطلب معلومات شخصية', icon: 'chatbox', color: '#9b59b6' },
    { title: 'انتحال شخصيات رسمية أو بنكية', icon: 'person', color: '#e74c3c' },
    { title: 'مواقع إلكترونية مزيفة ومقلدة', icon: 'globe', color: '#2ecc71' },
  ];

  const handleScroll = useCallback((event, setIndex) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setIndex(index);
  }, []);

  const scrollToNextItem = useCallback((ref, currentIndex, contentLength, setIndex) => {
    const nextIndex = (currentIndex + 1) % contentLength;
    ref.current?.scrollTo({ x: nextIndex * SLIDE_WIDTH, animated: true });
    setIndex(nextIndex);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      scrollToNextItem(awarenessScrollRef, activeAwarenessIndex, awarenessContent.length, setActiveAwarenessIndex);
      scrollToNextItem(adScrollRef, activeAdIndex, adContent.length, setActiveAdIndex);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timer);
  }, [activeAwarenessIndex, activeAdIndex, scrollToNextItem]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor="#003D4D" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>نصائح الأمان اليومية</Text>
          <View style={styles.awarenessSection}>
            <ScrollView ref={awarenessScrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => handleScroll(e, setActiveAwarenessIndex)} scrollEventThrottle={16} contentContainerStyle={styles.scrollViewContent}>
              {awarenessContent.map((item, index) => <AwarenessSlide key={index} {...item} />)}
            </ScrollView>
            <DotIndicator activeIndex={activeAwarenessIndex} length={awarenessContent.length} />
          </View>

          <Text style={styles.sectionTitle}>أنواع الاحتيال الشائعة</Text>
          <View style={styles.fraudTypesContainer}>
            {fraudCategories.map((category, index) => <FraudTypeItem key={index} {...category} />)}
          </View>

          <Text style={styles.sectionTitle}>منصات رسمية موثوقة</Text>
          <Text style={styles.sectionSubtitle}>اضغط للاستفادة من منصات التحقق والإبلاغ عن الاحتيال</Text>
          <View style={styles.adSection}>
            <ScrollView ref={adScrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => handleScroll(e, setActiveAdIndex)} scrollEventThrottle={16} contentContainerStyle={styles.scrollViewContent}>
              {adContent.map((item, index) => <AdSlide key={index} {...item} />)}
            </ScrollView>
            <DotIndicator activeIndex={activeAdIndex} length={adContent.length} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#F5F7FA' },
  sectionSubtitle: { fontSize: 14, color: '#666', marginTop: -10, marginBottom: 15, textAlign: 'right' },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#003D4D', marginVertical: 15, textAlign: 'right', fontFamily: 'Changa-SemiBold' },
  awarenessSection: { position: 'relative', width: SLIDE_WIDTH, height: height * 0.22, borderRadius: 15, marginBottom: 20, alignSelf: 'center', overflow: 'hidden', elevation: 3 },
  adSection: { position: 'relative', width: SLIDE_WIDTH, height: height * 0.25, borderRadius: 15, marginBottom: 20, alignSelf: 'center', overflow: 'hidden', elevation: 3 },
  scrollViewContent: { alignItems: 'center' },
  slide: { width: SLIDE_WIDTH, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderRadius: 15, padding: 15 },
  iconContainer: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  slideContent: { flex: 1, alignItems: 'flex-end' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#003D4D', textAlign: 'right', marginBottom: 5, fontFamily: 'Changa-SemiBold' },
  text: { fontSize: 14, color: '#333', textAlign: 'right', lineHeight: 20 },
  adSlide: { height: '100%', position: 'relative', borderRadius: 15, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  adImage: { width: '100%', height: '60%', resizeMode: 'cover' },
  adOverlay: { height: '30%', padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  adTitle: { fontSize: 17, fontWeight: 'bold', color: '#003D4D', textAlign: 'center', fontFamily: 'Changa-SemiBold', marginBottom: 4 },
  adDescription: { fontSize: 14, color: '#444', textAlign: 'center', fontWeight: '500' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 8, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.7)' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  fraudTypesContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, elevation: 2 },
  fraudTypeItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  fraudTypeIcon: { marginLeft: 10 },
  fraudTypeText: { fontSize: 14, color: '#333', textAlign: 'right', fontFamily: 'Changa-SemiBold' },
});

export default HomeScreen;