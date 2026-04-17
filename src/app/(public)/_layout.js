// app/(public)/_layout.js
// Layout شريط التبويب السفلي للشاشات العامة
// في CLI: هذا الإعداد منقول إلى navigation/AppNavigator.js (MainTabs)
// الملف محفوظ هنا للمرجعية وتوثيق الهيكل الأصلي

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './homescreen';
import ReportsScreen from './reports';
import DetectorScreen from './detector';
import MenuScreen from './menu';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ source, focused, size = { width: 24, height: 24 } }) => (
  <Image
    source={source}
    style={[
      styles.icon,
      {
        tintColor: focused ? '#E5BB30' : 'white',
        width: size.width,
        height: size.height,
      },
    ]}
    resizeMode="contain"
  />
);

export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#E5BB30',
        tabBarInactiveTintColor: 'white',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: 'white',
        tabBarLabelStyle: { marginBottom: 5 },
      }}>
      <Tab.Screen
        name="homescreen"
        component={HomeScreen}
        options={{
          title: 'خلك نبيه',
          tabBarLabel: 'الرئيسية',
          tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require('../assets/images/icons/home-svgrepo-com.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="reports"
        component={ReportsScreen}
        options={{
          title: 'البلاغات',
          tabBarLabel: 'البلاغات',
          tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require('../assets/images/icons/loudspeaker-4-svgrepo-com.png')}
              size={{ width: 31, height: 31 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="detector"
        component={DetectorScreen}
        options={{
          title: 'الكاشف',
          tabBarLabel: 'الكاشف',
          tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require('../assets/images/icons/bandit-svgrepo-com.png')}
              size={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="menu"
        component={MenuScreen}
        options={{
          title: 'القائمة',
          tabBarLabel: 'القائمة',
          tabBarLabelStyle: styles.bottomTitle,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              source={require('../assets/images/icons/list-dashes-duotone-svgrepo-com.png')}
              size={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#003D4D',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 5,
  },
  icon: {},
  header: {
    backgroundColor: '#003D4D',
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: { fontWeight: 'bold', fontSize: 20 },
  bottomTitle: { fontWeight: 'bold', fontSize: 12 },
});
