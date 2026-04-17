// navigation/AppNavigator.js
// الملاح الرئيسي - يحل محل expo-router بالكامل

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';

// الشاشات
import WelcomeScreen    from '../app/index';
import LoginScreen      from '../app/login';
import SignupScreen     from '../app/signup';
import HomeScreen       from '../app/(public)/homescreen';
import DetectorScreen   from '../app/(public)/detector';
import ReportsScreen    from '../app/(public)/reports';
import MenuScreen       from '../app/(public)/menu';
import AddReportScreen  from '../app/(praviate)/add_report';
import UserInfoScreen   from '../app/userinfo';
import FAQScreen        from '../app/FAQ';
import FeedbackScreen   from '../app/feedbacks';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TabBarIcon = ({ source, focused, size = { width: 24, height: 24 } }) => (
  <Image
    source={source}
    style={[styles.icon, { tintColor: focused ? '#E5BB30' : 'white', width: size.width, height: size.height }]}
    resizeMode="contain"
  />
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#E5BB30',
        tabBarInactiveTintColor: 'white',
        headerStyle: styles.header,
        headerTitleStyle: [styles.headerTitle, { textAlign: 'right' }],
        headerTintColor: 'white',
        tabBarLabelStyle: { marginBottom: 5 },
      }}>
      <Tab.Screen name="HomeScreen" component={HomeScreen}
        options={{ title: 'خلك نبيه', tabBarLabel: 'الرئيسية', tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} source={require('../assets/images/icons/home-svgrepo-com.png')} /> }} />
      <Tab.Screen name="ReportsScreen" component={ReportsScreen}
        options={{ title: 'البلاغات', tabBarLabel: 'البلاغات', tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} source={require('../assets/images/icons/loudspeaker-4-svgrepo-com.png')} size={{ width: 31, height: 31 }} /> }} />
      <Tab.Screen name="DetectorScreen" component={DetectorScreen}
        options={{ title: 'الكاشف', tabBarLabel: 'الكاشف', tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} source={require('../assets/images/icons/bandit-svgrepo-com.png')} size={{ width: 30, height: 30 }} /> }} />
      <Tab.Screen name="MenuScreen" component={MenuScreen}
        options={{ title: 'القائمة', tabBarLabel: 'القائمة', tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} source={require('../assets/images/icons/list-dashes-duotone-svgrepo-com.png')} size={{ width: 30, height: 30 }} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome"    component={WelcomeScreen} />
        <Stack.Screen name="Login"      component={LoginScreen} />
        <Stack.Screen name="Signup"     component={SignupScreen} />
        <Stack.Screen name="MainTabs"   component={MainTabs} />
        <Stack.Screen name="AddReport"  component={AddReportScreen} />
        <Stack.Screen name="UserInfo"   component={UserInfoScreen} />
        <Stack.Screen name="FAQ"        component={FAQScreen} />
        <Stack.Screen name="Feedback"   component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#003D4D', borderTopWidth: 0, elevation: 0, height: 60, paddingBottom: 5 },
  icon: {},
  header: { backgroundColor: '#003D4D', borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
  headerTitle: { fontWeight: 'bold', fontSize: 20 },
  bottomTitle: { fontWeight: 'bold', fontSize: 12 },
});
