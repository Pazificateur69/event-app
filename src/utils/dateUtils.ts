import { format, parseISO, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatEventDate = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    if (isToday(date)) {
      return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
    }
    
    if (isTomorrow(date)) {
      return `Demain à ${format(date, 'HH:mm', { locale: fr })}`;
    }
    
    if (isThisWeek(date)) {
      return format(date, 'EEEE à HH:mm', { locale: fr });
    }
    
    if (isThisMonth(date)) {
      return format(date, 'd MMMM à HH:mm', { locale: fr });
    }
    
    return format(date, 'd MMMM yyyy à HH:mm', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

export const formatShortDate = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'd MMM', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

export const formatFullDate = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'HH:mm', { locale: fr });
  } catch (error) {
    return dateString;
  }
};

export const getRelativeTime = (dateString: string): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      return 'Passé';
    }
    
    if (diffInHours < 24) {
      return `Dans ${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Dans ${diffInDays}j`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Dans ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `Dans ${diffInMonths} mois`;
  } catch (error) {
    return dateString;
  }
};