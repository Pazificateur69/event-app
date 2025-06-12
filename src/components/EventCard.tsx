import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Event } from '../types';

const { width } = Dimensions.get('window');

interface EventCardProps {
  event: Event;
  onPress: () => void;
  style?: any;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, style }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80';

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl || fallbackImage }}
          style={styles.image}
          defaultSource={{ uri: fallbackImage }}
        />
        
        {event.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>⭐ Premium</Text>
          </View>
        )}
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={14} color="#666" />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={14} color="#666" />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Icon name="dollar-sign" size={14} color="#1E88E5" />
            <Text style={styles.priceText}>
              {event.price === 0 ? 'Gratuit' : `${event.price}€`}
            </Text>
          </View>
        </View>
        
        {event.tags && event.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {event.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {event.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{event.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(30, 136, 229, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default EventCard;