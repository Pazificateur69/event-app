import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    // iOS permissions are handled automatically by the system
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission de localisation',
          message: 'WhatTheEvent a besoin d\'accéder à votre position pour vous montrer les événements à proximité.',
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Refuser',
          buttonPositive: 'Autoriser',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }

  return false;
};

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission caméra',
          message: 'WhatTheEvent a besoin d\'accéder à votre caméra pour prendre des photos.',
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Refuser',
          buttonPositive: 'Autoriser',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  }

  return false;
};

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission stockage',
          message: 'WhatTheEvent a besoin d\'accéder à votre stockage pour sauvegarder des images.',
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Refuser',
          buttonPositive: 'Autoriser',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Storage permission error:', err);
      return false;
    }
  }

  return false;
};

export const showPermissionAlert = (permissionType: string) => {
  Alert.alert(
    'Permission requise',
    `Pour utiliser cette fonctionnalité, veuillez autoriser l'accès ${permissionType} dans les paramètres de votre appareil.`,
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Paramètres', onPress: () => {
        // Open app settings - this would need a native module
        console.log('Open app settings');
      }},
    ]
  );
};