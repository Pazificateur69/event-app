import { create } from 'zustand';
import { supabase } from './supabaseClient';
import { Event, Reservation, UserProfile, Badge } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AppState {
  user: UserProfile | null;
  events: Event[];
  reservations: Reservation[];
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  fetchEvents: () => Promise<void>;
  fetchReservations: () => Promise<void>;
  makeReservation: (eventId: string, ticketCount: number, ticketType: string) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserAvatar: (file: File) => Promise<void>;
  updateSocialLinks: (links: { instagram?: string; twitter?: string; linkedin?: string }) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  fetchUserBadges: () => Promise<void>;
  initializeUser: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  events: [],
  reservations: [],
  badges: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  initializeUser: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!authUser) {
        set({ user: null });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          email: profile.email || authUser.email || '',
          displayName: profile.display_name || authUser.email?.split('@')[0] || 'Utilisateur',
          avatar: profile.avatar_url,
          bio: profile.bio,
          location: profile.location,
          preferences: {
            emailNotifications: profile.email_notifications ?? true,
            pushNotifications: profile.push_notifications ?? true,
            eventCategories: profile.event_categories || [],
            radius: profile.radius || 50,
            marketingEmails: false,
            newsletterSubscription: false,
            smsNotifications: false,
            language: 'fr',
            currency: 'EUR',
            timezone: 'Europe/Paris'
          },
          stats: {
            eventsAttended: 0,
            reviewsWritten: 0,
            badges: [],
            favoriteEvents: [],
            totalSpent: 0
          },
          socialLinks: profile.social_links,
          createdAt: profile.created_at,
          isActive: true
        };

        set({ user: userProfile });
      }
    } catch (error: any) {
      console.error('Error initializing user:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      // Mock data for mobile app
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Festival de Jazz de Paris',
          description: 'Le plus grand festival de jazz en France avec plus de 100 artistes internationaux.',
          date: '15 Juillet 2024',
          location: 'Paris',
          price: 45,
          imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
          category: 'Musique',
          organizer: 'Jazz Productions',
          isPremium: false,
          tags: ['Festival', 'Jazz', 'Concert'],
          coordinates: { lat: 48.8566, lng: 2.3522 }
        },
        {
          id: '2',
          title: 'Exposition Art Moderne',
          description: 'Une exposition exceptionnelle d\'art contemporain.',
          date: '20 Août 2024',
          location: 'Lyon',
          price: 15,
          imageUrl: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80',
          category: 'Art',
          organizer: 'Musée d\'Art Moderne',
          isPremium: true,
          tags: ['Art', 'Exposition', 'Culture'],
          coordinates: { lat: 45.7640, lng: 4.8357 }
        },
        {
          id: '3',
          title: 'Concert Rock',
          description: 'Une soirée rock inoubliable avec les meilleurs groupes.',
          date: '10 Septembre 2024',
          location: 'Marseille',
          price: 35,
          imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80',
          category: 'Musique',
          organizer: 'Rock Events',
          isPremium: false,
          tags: ['Rock', 'Concert', 'Musique'],
          coordinates: { lat: 43.2965, lng: 5.3698 }
        }
      ];

      set({ events: mockEvents });
    } catch (error: any) {
      console.error('Error in fetchEvents:', error);
      set({ 
        error: 'Unable to load events. Please try again later.',
        events: [] 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReservations: async () => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true, error: null });
      
      // Mock reservations data
      const mockReservations: Reservation[] = [
        {
          id: '1',
          eventId: '1',
          userId: user.id,
          eventName: 'Festival de Jazz de Paris',
          eventImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
          date: '15 Juillet 2024',
          time: '20:00',
          location: 'Paris',
          price: 45,
          ticketCount: 2,
          ticketType: 'Standard',
          status: 'confirmed',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket_1'
        }
      ];

      set({ reservations: mockReservations });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching reservations:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  makeReservation: async (eventId, ticketCount, ticketType) => {
    const { user } = get();
    if (!user) throw new Error('Vous devez être connecté pour réserver');

    try {
      set({ isLoading: true, error: null });
      
      // Mock reservation creation
      const newReservation: Reservation = {
        id: Date.now().toString(),
        eventId,
        userId: user.id,
        eventName: 'Nouvel événement',
        eventImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
        date: new Date().toLocaleDateString(),
        time: '20:00',
        location: 'Paris',
        price: 50,
        ticketCount,
        ticketType,
        status: 'confirmed'
      };

      const { reservations } = get();
      set({ reservations: [...reservations, newReservation] });
      
      return newReservation;
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error making reservation:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { reservations } = get();
      const updatedReservations = reservations.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'cancelled' as const }
          : reservation
      );
      
      set({ reservations: updatedReservations });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error canceling reservation:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true, error: null });
      set({ user: { ...user, ...updates } });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserAvatar: async (file) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true, error: null });
      // Mock avatar update
      set({ user: { ...user, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150' } });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating avatar:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSocialLinks: async (links) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true, error: null });
      set({ user: { ...user, socialLinks: links } });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating social links:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateInterests: async (interests) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true, error: null });
      set({ 
        user: { 
          ...user, 
          preferences: { 
            ...user.preferences, 
            eventCategories: interests 
          } 
        } 
      });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating interests:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserBadges: async () => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true, error: null });
      // Mock badges data
      set({ badges: [] });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching badges:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));