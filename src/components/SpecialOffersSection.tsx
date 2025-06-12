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

interface SpecialOffersSectionProps {
  offers: SpecialOffer[];
  onEventClick: (event: Event) => void;
}

const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  offers,
  onEventClick,
}) => {
  const renderOffer = (offer: SpecialOffer) => (
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
        
        {/* Events Preview */}
        <View style={styles.eventsPreview}>
          {offer.events.slice(0, 2).map((event, index) => (
            <View key={event.id} style={styles.eventPreview}>
              <Image
                source={{ uri: event.imageUrl }}
                style={styles.eventPreviewImage}
              />
              <Text style={styles.eventPreviewTitle} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{offer.originalPrice}€</Text>
          <Text style={styles.discountedPrice}>{offer.discountedPrice}€</Text>
        </View>
        
        <TouchableOpacity style={styles.offerButton}>
          <Text style={styles.offerButtonText}>Découvrir l'offre</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {offers.map(renderOffer)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  offerCard: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  offerHeader: {
    height: 100,
    backgroundColor: '#1E88E5',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  offerContent: {
    padding: 20,
  },
  offerTitle: {
    fontSize: 20,
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
  eventsPreview: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventPreview: {
    flex: 1,
    marginRight: 8,
  },
  eventPreviewImage: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
    resizeMode: 'cover',
  },
  eventPreviewTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  offerButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpecialOffersSection;