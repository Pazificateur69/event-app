import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'bell',
          title: 'Notifications push',
          subtitle: 'Recevoir des notifications sur votre appareil',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'mail',
          title: 'Notifications email',
          subtitle: 'Recevoir des emails pour les nouveaux événements',
          type: 'switch',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Confidentialité',
      items: [
        {
          icon: 'map-pin',
          title: 'Services de localisation',
          subtitle: 'Permettre l\'accès à votre position',
          type: 'switch',
          value: locationServices,
          onValueChange: setLocationServices,
        },
        {
          icon: 'shield',
          title: 'Confidentialité des données',
          subtitle: 'Gérer vos données personnelles',
          type: 'navigation',
          onPress: () => {/* Navigate to privacy settings */},
        },
      ],
    },
    {
      title: 'Apparence',
      items: [
        {
          icon: 'moon',
          title: 'Mode sombre',
          subtitle: 'Utiliser le thème sombre',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'type',
          title: 'Taille du texte',
          subtitle: 'Ajuster la taille du texte',
          type: 'navigation',
          onPress: () => {/* Navigate to text size settings */},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          title: 'Centre d\'aide',
          subtitle: 'FAQ et guides d\'utilisation',
          type: 'navigation',
          onPress: () => {/* Navigate to help center */},
        },
        {
          icon: 'message-circle',
          title: 'Nous contacter',
          subtitle: 'Envoyer vos commentaires',
          type: 'navigation',
          onPress: () => {/* Navigate to contact */},
        },
        {
          icon: 'star',
          title: 'Noter l\'application',
          subtitle: 'Donnez votre avis sur l\'App Store',
          type: 'navigation',
          onPress: () => {/* Open app store rating */},
        },
      ],
    },
    {
      title: 'Légal',
      items: [
        {
          icon: 'file-text',
          title: 'Conditions d\'utilisation',
          subtitle: 'Lire nos conditions',
          type: 'navigation',
          onPress: () => {/* Navigate to terms */},
        },
        {
          icon: 'lock',
          title: 'Politique de confidentialité',
          subtitle: 'Comment nous protégeons vos données',
          type: 'navigation',
          onPress: () => {/* Navigate to privacy policy */},
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name={item.icon} size={20} color="#1E88E5" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: '#E0E0E0', true: '#1E88E5' }}
          thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
        />
      ) : (
        <Icon name="chevron-right" size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.appVersionText}>Version 1.0.0</Text>
          <Text style={styles.appVersionText}>© 2024 WhatTheEvent</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  appVersion: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  appVersionText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});

export default SettingsScreen;