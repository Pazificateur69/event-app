import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useStore } from '../lib/store';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useStore();

  const menuItems = [
    {
      icon: 'user',
      title: 'Informations personnelles',
      subtitle: 'Modifier votre profil',
      onPress: () => {/* Navigate to profile edit */},
    },
    {
      icon: 'calendar',
      title: 'Mes réservations',
      subtitle: 'Voir vos événements réservés',
      onPress: () => navigation.navigate('Reservations'),
    },
    {
      icon: 'clock',
      title: 'Historique',
      subtitle: 'Événements passés',
      onPress: () => navigation.navigate('History'),
    },
    {
      icon: 'heart',
      title: 'Favoris',
      subtitle: 'Événements sauvegardés',
      onPress: () => {/* Navigate to favorites */},
    },
    {
      icon: 'bell',
      title: 'Notifications',
      subtitle: 'Gérer vos notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: 'settings',
      title: 'Paramètres',
      subtitle: 'Préférences de l\'application',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle',
      title: 'Aide & Support',
      subtitle: 'FAQ et contact',
      onPress: () => {/* Navigate to help */},
    },
    {
      icon: 'log-out',
      title: 'Déconnexion',
      subtitle: 'Se déconnecter de l\'application',
      onPress: () => {
        Alert.alert(
          'Déconnexion',
          'Êtes-vous sûr de vouloir vous déconnecter ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Déconnexion', style: 'destructive', onPress: () => {/* Handle logout */} },
          ]
        );
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>
            {user?.displayName || 'Utilisateur'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Événements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Avis</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.menuIconContainer,
                  item.icon === 'log-out' && styles.logoutIconContainer
                ]}>
                  <Icon
                    name={item.icon}
                    size={20}
                    color={item.icon === 'log-out' ? '#F44336' : '#1E88E5'}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[
                    styles.menuTitle,
                    item.icon === 'log-out' && styles.logoutText
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>WhatTheEvent v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 WhatTheEvent</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutIconContainer: {
    backgroundColor: '#FFEBEE',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  logoutText: {
    color: '#F44336',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});

export default ProfileScreen;