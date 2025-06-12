import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

class LocationService {
  async requestLocationPermission() {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization();
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permission de localisation",
            message: "L'application a besoin d'accéder à votre position pour vous montrer les événements à proximité.",
            buttonNeutral: "Demander plus tard",
            buttonNegative: "Annuler",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  watchPosition(callback) {
    return Geolocation.watchPosition(
      callback,
      error => console.error(error),
      { enableHighAccuracy: true, distanceFilter: 100 }
    );
  }

  clearWatch(watchId) {
    Geolocation.clearWatch(watchId);
  }
}

export default new LocationService();