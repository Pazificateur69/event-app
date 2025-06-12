import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [slideAnim] = React.useState(new Animated.Value(-width));
  const [opacityAnim] = React.useState(new Animated.Value(0));

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(toast.id);
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: '#4CAF50', iconName: 'check-circle' };
      case 'error':
        return { backgroundColor: '#F44336', iconName: 'x-circle' };
      case 'warning':
        return { backgroundColor: '#FF9800', iconName: 'alert-triangle' };
      case 'info':
      default:
        return { backgroundColor: '#2196F3', iconName: 'info' };
    }
  };

  const { backgroundColor, iconName } = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { backgroundColor },
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Icon name={iconName} size={20} color="#FFFFFF" style={styles.toastIcon} />
        <View style={styles.toastText}>
          <Text style={styles.toastTitle}>{toast.title}</Text>
          {toast.message && (
            <Text style={styles.toastMessage}>{toast.message}</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="x" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  toastContainer: {
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  toastMessage: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default ToastContainer;