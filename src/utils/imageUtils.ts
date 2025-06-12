import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { requestCameraPermission, requestStoragePermission } from './permissions';

export interface ImagePickerOptions {
  title?: string;
  allowsEditing?: boolean;
  quality?: number;
}

export const showImagePicker = (options: ImagePickerOptions = {}): Promise<string | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      options.title || 'Sélectionner une image',
      'Choisissez une source',
      [
        { text: 'Annuler', style: 'cancel', onPress: () => resolve(null) },
        {
          text: 'Galerie',
          onPress: async () => {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
              resolve(null);
              return;
            }

            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: options.quality || 0.8,
                includeBase64: false,
              },
              (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                  resolve(null);
                } else if (response.assets && response.assets[0]) {
                  resolve(response.assets[0].uri || null);
                } else {
                  resolve(null);
                }
              }
            );
          },
        },
        {
          text: 'Caméra',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              resolve(null);
              return;
            }

            launchCamera(
              {
                mediaType: 'photo',
                quality: options.quality || 0.8,
                includeBase64: false,
              },
              (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                  resolve(null);
                } else if (response.assets && response.assets[0]) {
                  resolve(response.assets[0].uri || null);
                } else {
                  resolve(null);
                }
              }
            );
          },
        },
      ]
    );
  });
};

export const resizeImage = (uri: string, maxWidth: number = 800, maxHeight: number = 600): Promise<string> => {
  // This would typically use a library like react-native-image-resizer
  // For now, we'll return the original URI
  return Promise.resolve(uri);
};

export const compressImage = (uri: string, quality: number = 0.8): Promise<string> => {
  // This would typically use a library for image compression
  // For now, we'll return the original URI
  return Promise.resolve(uri);
};