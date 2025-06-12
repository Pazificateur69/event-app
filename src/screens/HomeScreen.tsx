import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useStore } from '../lib/store';
import EventCard from '../components/EventCard';
import EventCarousel from '../components/EventCarousel';
import SearchBar from '../components/SearchBar';
import SpecialOffers from '../components/SpecialOffers';
import { Event } from '../types';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { fetchEvents, events } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });

    loadEvents();

    return () => unsubscribe();
  }, []);

  const loadEvents = async () => {
    try {
      if (isOnline) {
        await fetchEvents();
        await AsyncStorage.setItem('cached_events', JSON.stringify(events));
      } else {
        const cachedEvents = await AsyncStorage.getItem('cached_events');
        if (cachedEvents) {
          // Load cached events when offline
        }
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', { event });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const premiumEvents = events.filter(event => event.isPremium);
  const trendingEvents = events.filter(event => !event.isPremium);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What's The Event Today?</Text>
          <Text style={styles.subtitle}>Où vous voulez, quand vous voulez</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar onPress={handleSearchPress} />
        </View>

        {/* Premium Events Carousel */}
        {premiumEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Événements Premium</Text>
            <EventCarousel
              events={premiumEvents}
              onEventPress={handleEventPress}
            />
          </View>
        )}

        {/* Special Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offres Spéciales</Text>
          <SpecialOffers onEventPress={handleEventPress} />
        </View>

        {/* Trending Events */}
        {trendingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tendances</Text>
            <View style={styles.eventsGrid}>
              {trendingEvents.slice(0, 6).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => handleEventPress(event)}
                  style={styles.eventCard}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  eventsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
});

export default HomeScreen;