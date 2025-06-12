import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useStore } from '../lib/store';
import { Reservation } from '../types';

const ReservationsScreen = () => {
  const navigation = useNavigation();
  const { reservations, fetchReservations, cancelReservation } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations();
    setRefreshing(false);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    Alert.alert(
      'Annuler la réservation',
      `Êtes-vous sûr de vouloir annuler votre réservation pour "${reservation.eventName}" ?`,
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelReservation(reservation.id);
              Alert.alert('Succès', 'Votre réservation a été annulée.');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'annuler la réservation.');
            }
          },
        },
      ]
    );
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const renderReservation = (reservation: Reservation) => (
    <View key={reservation.id} style={styles.reservationCard}>
      <Image
        source={{ uri: reservation.eventImage }}
        style={styles.eventImage}
      />
      
      <View style={styles.reservationContent}>
        <View style={styles.reservationHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {reservation.eventName}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) }]}>
            <Text style={styles.statusText}>{getStatusText(reservation.status)}</Text>
          </View>
        </View>
        
        <View style={styles.reservationDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{reservation.date} à {reservation.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={16} color="#666" />
            <Text style={styles.detailText}>{reservation.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="users" size={16} color="#666" />
            <Text style={styles.detailText}>
              {reservation.ticketCount} billet(s) - {reservation.ticketType}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="dollar-sign" size={16} color="#666" />
            <Text style={styles.detailText}>
              {reservation.price * reservation.ticketCount}€
            </Text>
          </View>
        </View>
        
        {reservation.status !== 'cancelled' && (
          <View style={styles.reservationActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {/* Handle view ticket */}}
            >
              <Icon name="eye" size={16} color="#1E88E5" />
              <Text style={styles.actionButtonText}>Voir le billet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelReservation(reservation)}
            >
              <Icon name="x" size={16} color="#F44336" />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Réservations</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'confirmed', label: 'Confirmées' },
          { key: 'pending', label: 'En attente' },
          { key: 'cancelled', label: 'Annulées' },
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

      {/* Reservations List */}
      <ScrollView
        style={styles.reservationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReservations.length > 0 ? (
          filteredReservations.map(renderReservation)
        ) : (
          <View style={styles.emptyState}>
            <Icon name="calendar" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>Aucune réservation trouvée</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.exploreButtonText}>Explorer les événements</Text>
            </TouchableOpacity>
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
  reservationsList: {
    flex: 1,
    padding: 16,
  },
  reservationCard: {
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
  reservationContent: {
    padding: 16,
  },
  reservationHeader: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  reservationDetails: {
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
  reservationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFF0F0',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#1E88E5',
    marginLeft: 4,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#F44336',
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
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ReservationsScreen;