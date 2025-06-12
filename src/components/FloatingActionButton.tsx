import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface FloatingActionButtonProps {
  onShowCalendar: () => void;
  onShowMap: () => void;
  onShowFavorites: () => void;
  onShare: () => void;
  onFilter: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onShowCalendar,
  onShowMap,
  onShowFavorites,
  onShare,
  onFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    setIsOpen(!isOpen);
  };

  const actions = [
    { icon: 'calendar', label: 'Calendrier', onPress: onShowCalendar },
    { icon: 'map', label: 'Carte', onPress: onShowMap },
    { icon: 'heart', label: 'Favoris', onPress: onShowFavorites },
    { icon: 'share', label: 'Partager', onPress: onShare },
    { icon: 'filter', label: 'Filtrer', onPress: onFilter },
  ];

  const renderActionButton = (action: any, index: number) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -(60 * (index + 1))],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <Animated.View
        key={action.icon}
        style={[
          styles.actionButton,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButtonTouchable}
          onPress={() => {
            action.onPress();
            toggleMenu();
          }}
        >
          <Icon name={action.icon} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </Animated.View>
    );
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {actions.map((action, index) => renderActionButton(action, index))}
      
      <TouchableOpacity
        style={styles.mainButton}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Icon name="plus" size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  actionButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 0,
  },
  actionButtonTouchable: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  actionLabel: {
    marginLeft: 8,
    fontSize: 12,
    color: '#333',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
});

export default FloatingActionButton;