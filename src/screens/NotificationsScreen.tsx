import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

interface Notification {
  id: string;
  type: 'event_reminder' | 'new_event' | 'booking_confirmation' | 'event_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'event_reminder',
        title: 'Rappel d\'événement',
        message: 'Le Festival de Jazz de Paris commence dans 2 heures !',
        timestamp: '2024-02-15T18:00:00Z',
        read: false,
      },
      {
        id: '2',
        type: 'booking_confirmation',
        title: 'Réservation confirmée',
        message: 'Votre réservation pour l\'Exposition Art Moderne a été confirmée.',
        timestamp: '2024-02-15T14:30:00Z',
        read: false,
      },
      {
        id: '3',
        type: 'new_event',
        title: 'Nouvel événement',
        message: 'Un nouvel événement de musique électronique vient d\'être ajouté près de chez vous.',
        timestamp: '2024-02-15T10:15:00Z',
        read: true,
      },
      {
        id: '4',
        type: 'event_update',
        title: 'Mise à jour d\'événement',
        message: 'L\'heure du Concert de Rock a été modifiée. Nouvelle heure : 21h00.',
        timestamp: '2024-02-14T16:45:00Z',
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return 'clock';
      case 'new_event':
        return 'plus-circle';
      case 'booking_confirmation':
        return 'check-circle';
      case 'event_update':
        return 'edit';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return '#FF9800';
      case 'new_event':
        return '#4CAF50';
      case 'booking_confirmation':
        return '#2196F3';
      case 'event_update':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllReadText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationContent}>
                <View style={[
                  styles.notificationIcon,
                  { backgroundColor: `${getNotificationColor(notification.type)}20` }
                ]}>
                  <Icon
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                </View>
                
                <View style={styles.notificationText}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadText
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTimestamp}>
                    {formatTimestamp(notification.timestamp)}
                  </Text>
                </View>
                
                {!notification.read && (
                  <View style={styles.unreadIndicator} />
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="bell" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>Aucune notification</Text>
            <Text style={styles.emptyStateSubtext}>
              Vous recevrez ici les notifications concernant vos événements
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  markAllReadText: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '500',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  unreadNotification: {
    backgroundColor: '#F8F9FF',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E88E5',
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    lineHeight: 20,
  },
});

export default NotificationsScreen;