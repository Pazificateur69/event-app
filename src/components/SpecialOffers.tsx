import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Event } from '../types';

const { width } = Dimensions.get('window');

interface SpecialOffer {
  id: string;
  title: string;
  events: Event[];
  originalPrice: number;
  discountedPrice: number;
  description: string;
  savings: string;
}

interface SpecialOffersProps {
  onEventPress: (event: Event) => void;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ onEventPress }) => {
  const offers: SpecialOffer[] = [
    {
      id: 'pack1',
      title: 'Pack Festival & Culture',
      events: [],
      originalPrice: 120,
      discountedPrice: 99,
      description: 'Découvrez nos événements culturels à prix réduit',
      savings: '17% de réduction'
    },
    {
      id: 'pack2',
      title: 'Week-end Musical',
      events: [],
      originalPrice: 80,
      discountedPrice: 65,
      description: 'Deux concerts pour le prix d\'un et demi',
      savings: '19% de réduction'
    }
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {offers.map((offer) => (
        <TouchableOpacity key={offer.id} style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <View style={styles.discountBadge}>
              <Icon name="percent" size={16} color="#FFFFFF" />
              <Text style={styles.discountText}>{offer.savings}</Text>
            </View>
          </View>
          
          <View style={styles.offerContent}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDescription}>{offer.description}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>{offer.originalPrice}€</Text>
              <Text style={styles.discountedPrice}>{offer.discountedPrice}€</Text>
            </View>
            
            <TouchableOpacity style={styles.offerButton}>
              <Text style={styles.offerButtonText}>Découvrir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  offerCard: {
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  offerHeader: {
    height: 120,
    backgroundColor: '#1E88E5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  offerButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpecialOffers;