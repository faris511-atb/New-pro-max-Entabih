// app/index.js
// شاشة البداية - بدون expo-font

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Image, Text, Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => (
  <View style={styles.splashContainer}>
    <Animatable.View
      animation="zoomIn"
      duration={1500}
      style={styles.splashLogoContainer}
      onAnimationEnd={onAnimationComplete}>
      <Text style={styles.splashText}>انتبه</Text>
    </Animatable.View>
  </View>
);

const WelcomeScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const navigationTimer = setTimeout(() => {
        navigation.replace('MainTabs');
      }, 1820);
      return () => clearTimeout(navigationTimer);
    }
  }, [showSplash, navigation]);

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  return (
    <Animatable.View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animatable.Image
          source={require('../assets/images/Yello/search-svgrepo-com.png')}
          style={styles.backgroundImage}
          animation="fadeIn"
          duration={1300}
        />
        <Animatable.Image
          source={require('../assets/images/icons/bandit-svgrepo-com.png')}
          style={styles.overlayImage}
          animation="fadeIn"
          duration={1300}
        />
      </View>
      <Animatable.Text style={styles.headerText} animation="slideInDown" duration={1500}>
        انتبه
      </Animatable.Text>
      <Animatable.Text style={styles.text} animation="fadeIn" duration={1000}>
        بیاناتك کنز حافظ علیها
      </Animatable.Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#0C343C', justifyContent: 'center', alignItems: 'center' },
  splashLogoContainer: { alignItems: 'center' },
  splashText: { color: '#E5BB30', fontSize: 50, marginBottom: 75, fontFamily: 'Changa-SemiBold' },
  container: { flex: 1, backgroundColor: '#0C343C', alignItems: 'center', justifyContent: 'center' },
  imageContainer: { position: 'relative', width: 200, height: 200, marginBottom: 20 },
  backgroundImage: { width: 210, height: 210, marginLeft: 9, marginTop: 9, position: 'absolute', zIndex: 1 },
  overlayImage: { width: 100, height: 100, position: 'absolute', top: 50, left: 50, zIndex: 2 },
  headerText: { color: '#E5BB30', fontSize: 50, textAlign: 'center', fontFamily: 'Changa-SemiBold' },
  text: { marginTop: 100, color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
});

export default WelcomeScreen;