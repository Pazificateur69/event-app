export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  organizer: string;
  isPremium?: boolean;
  tags?: string[];
  bookingUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  attendees?: number;
  rating?: number;
  reviews?: number;
  duration?: string;
  ageRestriction?: string;
  accessibility?: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface QuestionnaireResponse {
  interests: string[];
  preferredLocations: string[];
  budget: 'low' | 'medium' | 'high';
  availability: ('weekend' | 'weekday' | 'evening')[];
  groupSize: 'solo' | 'couple' | 'small' | 'large';
  travelDistance: number;
  eventTypes: ('indoor' | 'outdoor' | 'both')[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'single' | 'range';
  options?: string[];
  min?: number;
  max?: number;
}

export interface SearchFilters {
  category: string[];
  radius: number;
  priceRange: [number, number];
  date: Date | null;
  tags?: string[];
  sortBy: 'date' | 'price' | 'popularity' | 'rating';
  accessibility?: string[];
  ageRestriction?: string;
}

export interface SearchResults {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
  facets?: {
    categories: { name: string; count: number }[];
    priceRanges: { range: string; count: number }[];
    locations: { name: string; count: number }[];
  };
}

export interface NotificationSettings {
  email: {
    newEvents: boolean;
    reminders: boolean;
    recommendations: boolean;
    updates: boolean;
  };
  push: {
    newEvents: boolean;
    reminders: boolean;
    recommendations: boolean;
    updates: boolean;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    eventCategories: string[];
    radius: number;
    marketingEmails: boolean;
    newsletterSubscription: boolean;
    smsNotifications: boolean;
    language: string;
    currency: string;
    timezone: string;
  };
  stats?: {
    eventsAttended: number;
    reviewsWritten: number;
    badges: string[];
    favoriteEvents: string[];
    totalSpent: number;
  };
  socialLinks?: {
    [key: string]: string;
  };
  gdprConsent?: {
    marketing: boolean;
    thirdParty: boolean;
    acceptedAt: string;
  };
  lastLogin?: string;
  isActive: boolean;
  subscription?: {
    type: 'free' | 'premium' | 'vip';
    expiresAt?: string;
    features: string[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'events_attended' | 'reviews_written' | 'special_achievement';
    threshold?: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  eventName: string;
  eventImage: string;
  date: string;
  time: string;
  location: string;
  price: number;
  ticketCount: number;
  ticketType: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'refunded';
  qrCode?: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
  companions?: {
    name: string;
    email?: string;
  }[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  images?: string[];
  verified: boolean;
}

export interface EventAnalytics {
  views: number;
  bookings: number;
  revenue: number;
  averageRating: number;
  conversionRate: number;
  popularTimes: { hour: number; bookings: number }[];
  demographics: {
    ageGroups: { range: string; percentage: number }[];
    locations: { city: string; percentage: number }[];
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'event_reminder' | 'new_event' | 'booking_confirmation' | 'event_update' | 'promotion';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  scheduledFor?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  eventId?: string;
  type: 'event' | 'reminder' | 'personal';
}