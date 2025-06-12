import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
  async requestUserPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    }
    return true;
  }

  async getFCMToken() {
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      
      if (!fcmToken) {
        const newToken = await messaging().getToken();
        if (newToken) {
          await AsyncStorage.setItem('fcmToken', newToken);
          return newToken;
        }
      }

      return fcmToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async registerNotificationListeners() {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
    });

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
      // Here you can show a local notification
    });

    // Handle notification open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      // Navigate to appropriate screen based on notification data
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          // Navigate to appropriate screen based on notification data
        }
      });

    return unsubscribe;
  }
}

export default new NotificationService();