import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Event } from '../types';

const { width } = Dimensions.get('window');

interface EventCarouselProps {
  events: Event[];
  onEventPress: (event: Event) => void;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ events, onEventPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {events.map((event, index) => (
          <TouchableOpacity
            key={event.id}
            style={styles.slide}
            onPress={() => onEventPress(event)}
          >
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.image}
            />
            
            <View style={styles.overlay} />
            
            <View style={styles.content}>
              {event.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>⭐ Premium</Text>
                </View>
              )}
              
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
              
              <View style={styles.textContent}>
                <Text style={styles.title} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                  {event.description}
                </Text>
                
                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>{event.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="map-pin" size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="dollar-sign" size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>
                      {event.price === 0 ? 'Gratuit' : `${event.price}€`}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.discoverButton}>
                  <Text style={styles.discoverButtonText}>Découvrir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {events.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
      
      {/* Slide Counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {events.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
  },
  premiumBadge: {
    position: 'absolute',
    top: 20,
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
  categoryBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(30, 136, 229, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  textContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.9,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  discoverButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  counter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default EventCarousel;