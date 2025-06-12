import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useStore } from '../lib/store';
import { Event } from '../types';

const { width, height } = Dimensions.get('window');

const EventDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params as { event: Event };
  const { makeReservation } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReservation = async () => {
    try {
      setIsLoading(true);
      await makeReservation(event.id, 1, 'Standard');
      Alert.alert(
        'Réservation confirmée',
        'Votre réservation a été enregistrée avec succès !',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la réservation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cet événement : ${event.title} le ${event.date} à ${event.location}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Image Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
          
          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.rightActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleFavorite}
              >
                <Icon
                  name={isFavorite ? "heart" : "heart"}
                  size={24}
                  color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
                  fill={isFavorite ? "#FF6B6B" : "transparent"}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Icon name="share" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Premium Badge */}
          {event.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>⭐ Premium</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Category */}
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          {/* Event Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>{event.date}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="map-pin" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="user" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>{event.organizer}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="dollar-sign" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>
                {event.price === 0 ? 'Gratuit' : `${event.price}€`}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {event.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Stats */}
          {(event.attendees || event.rating) && (
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              <View style={styles.statsContainer}>
                {event.attendees && (
                  <View style={styles.statItem}>
                    <Icon name="users" size={20} color="#666" />
                    <Text style={styles.statText}>{event.attendees} participants</Text>
                  </View>
                )}
                {event.rating && (
                  <View style={styles.statItem}>
                    <Icon name="star" size={20} color="#FFD700" />
                    <Text style={styles.statText}>{event.rating}/5</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Prix</Text>
          <Text style={styles.priceValue}>
            {event.price === 0 ? 'Gratuit' : `${event.price}€`}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.reserveButton, isLoading && styles.reserveButtonDisabled]}
          onPress={handleReservation}
          disabled={isLoading}
        >
          <Text style={styles.reserveButtonText}>
            {isLoading ? 'Réservation...' : 'Réserver'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.4,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rightActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  premiumBadge: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 25,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  statsSection: {
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  reserveButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginLeft: 20,
  },
  reserveButtonDisabled: {
    backgroundColor: '#CCC',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetailScreen;