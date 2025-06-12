import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface SearchBarProps {
  onPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name="search" size={20} color="#666" style={styles.icon} />
      <Text style={styles.placeholder}>Rechercher un événement...</Text>
      <Icon name="sliders" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  icon: {
    marginRight: 12,
  },
  placeholder: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
});

export default SearchBar;