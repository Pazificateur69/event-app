import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

interface HistoryEvent {
  id: string;
  eventName: string;
  eventImage: string;
  date: string;
  location: string;
  rating: number | null;
  reviewed: boolean;
  review?: string;
  price: number;
  category: string;
}

const HistoryScreen = () => {
  const [pastEvents, setPastEvents] = useState<HistoryEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'not-reviewed'>('all');

  useEffect(() => {
    loadPastEvents();
  }, []);

  const loadPastEvents = () => {
    // Mock data for past events
    const mockEvents: HistoryEvent[] = [
      {
        id: '1',
        eventName: 'Festival de Jazz de Paris',
        eventImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
        date: '15 Janvier 2024',
        location: 'Paris',
        rating: 4,
        reviewed: true,
        review: 'Une soirée incroyable ! L\'ambiance était électrique.',
        price: 45,
        category: 'Musique',
      },
      {
        id: '2',
        eventName: 'Exposition Art Moderne',
        eventImage: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80',
        date: '20 Décembre 2023',
        location: 'Lyon',
        rating: null,
        reviewed: false,
        price: 15,
        category: 'Art',
      },
    ];
    setPastEvents(mockEvents);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadPastEvents();
    setRefreshing(false);
  };

  const handleAddReview = (eventId: string) => {
    Alert.prompt(
      'Ajouter un avis',
      'Que pensez-vous de cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Publier',
          onPress: (review) => {
            if (review) {
              setPastEvents(prev =>
                prev.map(event =>
                  event.id === eventId
                    ? { ...event, review, reviewed: true, rating: 4 }
                    : event
                )
              );
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const filteredEvents = pastEvents.filter(event => {
    if (filter === 'reviewed') return event.reviewed;
    if (filter === 'not-reviewed') return !event.reviewed;
    return true;
  });

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Icon
            key={star}
            name="star"
            size={16}
            color={star <= rating ? '#FFD700' : '#E0E0E0'}
            style={star <= rating ? styles.filledStar : undefined}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'Tous' },
          { key: 'reviewed', label: 'Avec avis' },
          { key: 'not-reviewed', label: 'Sans avis' },
        ].map(filterOption => (
          <TouchableOpacity
            key={filterOption.key}
            style={[
              styles.filterTab,
              filter === filterOption.key && styles.filterTabActive
            ]}
            onPress={() => setFilter(filterOption.key as any)}
          >
            <Text style={[
              styles.filterTabText,
              filter === filterOption.key && styles.filterTabTextActive
            ]}>
              {filterOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      <ScrollView
        style={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <Image
                source={{ uri: event.eventImage }}
                style={styles.eventImage}
              />
              
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.eventName}
                  </Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{event.category}</Text>
                  </View>
                </View>
                
                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>{event.date}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Icon name="map-pin" size={16} color="#666" />
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Icon name="dollar-sign" size={16} color="#666" />
                    <Text style={styles.detailText}>{event.price}€</Text>
                  </View>
                </View>
                
                {event.reviewed ? (
                  <View style={styles.reviewSection}>
                    {renderStars(event.rating)}
                    {event.review && (
                      <Text style={styles.reviewText}>{event.review}</Text>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addReviewButton}
                    onPress={() => handleAddReview(event.id)}
                  >
                    <Icon name="edit" size={16} color="#1E88E5" />
                    <Text style={styles.addReviewText}>Laisser un avis</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="clock" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>Aucun événement passé</Text>
            <Text style={styles.emptyStateSubtext}>
              Vos événements passés apparaîtront ici
            </Text>
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
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterTabActive: {
    backgroundColor: '#1E88E5',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  eventsList: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  reviewSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filledStar: {
    // Style for filled stars if needed
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addReviewText: {
    fontSize: 14,
    color: '#1E88E5',
    marginLeft: 8,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HistoryScreen;