import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import EventCarousel from './components/EventCarousel';
import SearchBar from './components/SearchBar';
import EventCard from './components/EventCard';
import SearchPage from './components/SearchPage';
import EventDetailPage from './components/EventDetailPage';
import SettingsPage from './components/SettingsPage';
import ReservationsPage from './components/ReservationsPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import NotificationsSettingsPage from './components/NotificationsSettingsPage';
import QuestionnaireModal from './components/QuestionnaireModal';
import SpecialOffersSection from './components/SpecialOffersSection';
import FloatingActionButton from './components/FloatingActionButton';
import { ToastContainer } from './components/NotificationToast';
import { Event, QuestionnaireResponse } from './types';
import { useStore } from './lib/store';
import { useToast } from './hooks/useToast';

const premiumEvents: Event[] = [
  {
    id: '1',
    title: 'Hellfest 2024',
    description: 'Le plus grand festival de metal en France avec plus de 180 groupes sur 6 scènes pendant 4 jours.',
    date: '27-30 Juin 2024',
    location: 'Clisson',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80',
    category: 'Musique',
    isPremium: true,
    organizer: 'Hellfest Productions',
    bookingUrl: 'https://www.hellfest.fr/tickets',
    tags: ['Festival', 'Metal', 'Rock', 'Concert'],
    attendees: 180000,
    rating: 4.8,
    reviews: 2547
  },
  {
    id: '2',
    title: 'Paris Photo 2024',
    description: 'La plus grande foire internationale dédiée au medium photographique.',
    date: '7-10 Novembre 2024',
    location: 'Grand Palais Éphémère, Paris',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80',
    category: 'Art',
    isPremium: true,
    organizer: 'RX France',
    bookingUrl: 'https://www.parisphoto.com/fr-fr/billetterie.html',
    tags: ['Exposition', 'Photographie', 'Art contemporain'],
    attendees: 65000,
    rating: 4.6,
    reviews: 892
  },
  {
    id: '7',
    title: 'Tomorrowland Winter 2024',
    description: 'Le festival de musique électronique le plus magique dans un cadre montagneux exceptionnel.',
    date: '16-23 Mars 2024',
    location: 'Alpe d\'Huez',
    price: 695,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80',
    category: 'Musique',
    isPremium: true,
    organizer: 'Tomorrowland',
    bookingUrl: 'https://www.tomorrowland.com/winter/tickets',
    tags: ['Festival', 'Électro', 'Montagne', 'Premium'],
    attendees: 22000,
    rating: 4.9,
    reviews: 1456
  },
  {
    id: '8',
    title: 'Formula 1 Grand Prix de Monaco 2024',
    description: 'Le plus prestigieux Grand Prix de Formule 1 dans les rues de Monte-Carlo.',
    date: '26 Mai 2024',
    location: 'Monte-Carlo, Monaco',
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80',
    category: 'Sport',
    isPremium: true,
    organizer: 'Automobile Club de Monaco',
    bookingUrl: 'https://www.formula1.com/tickets/monaco',
    tags: ['F1', 'Course', 'Luxe', 'Premium'],
    attendees: 78000,
    rating: 4.7,
    reviews: 3241
  }
];

const trendingEvents: Event[] = [
  {
    id: '3',
    title: 'Roland-Garros 2024',
    description: 'Le plus prestigieux tournoi de tennis sur terre battue.',
    date: '20 Mai - 9 Juin 2024',
    location: 'Roland-Garros, Paris',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80',
    category: 'Sport',
    organizer: 'Fédération Française de Tennis',
    bookingUrl: 'https://tickets.rolandgarros.com',
    tags: ['Tennis', 'Sport', 'Grand Chelem'],
    attendees: 500000,
    rating: 4.5,
    reviews: 1876
  },
  {
    id: '4',
    title: 'Salon du Chocolat 2024',
    description: 'Le plus grand événement mondial dédié au chocolat et au cacao.',
    date: '30 Octobre - 3 Novembre 2024',
    location: 'Paris Expo Porte de Versailles',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80',
    category: 'Gastronomie',
    organizer: 'Event International',
    bookingUrl: 'https://www.salon-du-chocolat.com/paris/billetterie',
    tags: ['Gastronomie', 'Chocolat', 'Salon'],
    attendees: 120000,
    rating: 4.3,
    reviews: 654
  },
  {
    id: '5',
    title: 'Festival d\'Avignon 2024',
    description: 'Le plus grand festival de théâtre vivant au monde.',
    date: '3-23 Juillet 2024',
    location: 'Avignon',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80',
    category: 'Théâtre',
    organizer: 'Festival d\'Avignon',
    bookingUrl: 'https://www.festival-avignon.com/fr/billetterie',
    tags: ['Théâtre', 'Festival', 'Culture'],
    attendees: 140000,
    rating: 4.4,
    reviews: 987
  },
  {
    id: '6',
    title: 'Fête des Lumières 2024',
    description: 'Un spectacle lumineux magique à travers toute la ville.',
    date: '5-8 Décembre 2024',
    location: 'Lyon',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1576344333162-f83e5e18902e?auto=format&fit=crop&q=80',
    category: 'Art',
    organizer: 'Ville de Lyon',
    bookingUrl: 'https://www.fetedeslumieres.lyon.fr',
    tags: ['Lumières', 'Festival', 'Gratuit'],
    attendees: 2000000,
    rating: 4.7,
    reviews: 4521
  },
  {
    id: '9',
    title: 'Lollapalooza Paris 2024',
    description: 'Le festival international de musique revient à Paris avec une programmation exceptionnelle.',
    date: '19-21 Juillet 2024',
    location: 'Hippodrome de Longchamp, Paris',
    price: 89,
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80',
    category: 'Musique',
    organizer: 'Live Nation',
    bookingUrl: 'https://www.lollaparis.com/tickets',
    tags: ['Festival', 'Musique', 'International'],
    attendees: 85000,
    rating: 4.6,
    reviews: 2134
  },
  {
    id: '10',
    title: 'Japan Expo 2024',
    description: 'Le plus grand salon européen de la culture japonaise.',
    date: '11-14 Juillet 2024',
    location: 'Paris-Nord Villepinte',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&q=80',
    category: 'Culture',
    organizer: 'SEFA Event',
    bookingUrl: 'https://www.japan-expo-paris.com/tickets',
    tags: ['Japon', 'Manga', 'Culture', 'Cosplay'],
    attendees: 250000,
    rating: 4.5,
    reviews: 1765
  }
];

const specialOffers = [
  {
    id: 'pack1',
    title: 'Pack Festival & Gastronomie',
    events: [trendingEvents[3], premiumEvents[0]],
    originalPrice: 314,
    discountedPrice: 269,
    description: 'Combinez le Salon du Chocolat et le Hellfest pour une expérience unique !',
    savings: '15% de réduction'
  },
  {
    id: 'pack2',
    title: 'Week-end Culture',
    events: [premiumEvents[1], trendingEvents[4]],
    originalPrice: 55,
    discountedPrice: 45,
    description: 'Paris Photo + Festival d\'Avignon : immergez-vous dans l\'art !',
    savings: '18% de réduction'
  },
  {
    id: 'pack3',
    title: 'Pack Festival Électro Premium',
    events: [premiumEvents[2], trendingEvents[8]],
    originalPrice: 784,
    discountedPrice: 699,
    description: 'Tomorrowland Winter + Lollapalooza : la combinaison parfaite pour les amateurs de musique électronique !',
    savings: '11% de réduction'
  },
  {
    id: 'pack4',
    title: 'Pack Sport de Prestige',
    events: [premiumEvents[3], trendingEvents[2]],
    originalPrice: 670,
    discountedPrice: 599,
    description: 'Grand Prix de Monaco + Roland-Garros : vivez le sport dans sa plus belle expression !',
    savings: '10% de réduction'
  }
].map(offer => ({
  ...offer,
  events: offer.events.filter(Boolean)
}));

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'detail' | 'settings' | 'reservations' | 'history' | 'profile' | 'notifications' | 'notifications-settings'>('home');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<QuestionnaireResponse | null>(null);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<Set<string>>(new Set());

  const { fetchEvents, fetchReservations, fetchUserBadges } = useStore();
  const { toasts, removeToast, success, error, info } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchReservations();
    fetchUserBadges();

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }

    const hasCompleted = localStorage.getItem('hasCompletedQuestionnaire');
    const storedPreferences = localStorage.getItem('questionnaireResponses');
    const storedFavorites = localStorage.getItem('favoriteEvents');
    
    if (hasCompleted && storedPreferences) {
      setHasCompletedQuestionnaire(true);
      setShowQuestionnaire(false);
      setUserPreferences(JSON.parse(storedPreferences));
    }

    if (storedFavorites) {
      setFavoriteEvents(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  useEffect(() => {
    if (userPreferences) {
      const filteredEvents = filterEventsByPreferences(userPreferences);
      setRecommendedEvents(filteredEvents);
    }
  }, [userPreferences]);

  const handleSearch = (query: string, location?: string, date?: Date) => {
    setCurrentPage('search');
    info('Recherche en cours...', `Recherche pour "${query}"`);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentPage('detail');
  };

  const handleFavoriteToggle = (eventId: string) => {
    const newFavorites = new Set(favoriteEvents);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
      success('Retiré des favoris', 'L\'événement a été retiré de vos favoris');
    } else {
      newFavorites.add(eventId);
      success('Ajouté aux favoris', 'L\'événement a été ajouté à vos favoris');
    }
    setFavoriteEvents(newFavorites);
    localStorage.setItem('favoriteEvents', JSON.stringify(Array.from(newFavorites)));
  };

  const handleEventShare = async (event: Event) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        success('Lien copié', 'Le lien de l\'événement a été copié dans le presse-papier');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSkipQuestionnaire = () => {
    setShowQuestionnaire(false);
    localStorage.setItem('hasCompletedQuestionnaire', 'true');
    info('Questionnaire ignoré', 'Vous pourrez le compléter plus tard dans vos paramètres');
  };

  const filterEventsByPreferences = (preferences: QuestionnaireResponse): Event[] => {
    const allEvents = [...premiumEvents, ...trendingEvents];
    
    return allEvents.filter(event => {
      const matchesInterests = preferences.interests.some(interest => 
        event.category.toLowerCase() === interest.toLowerCase() ||
        event.tags?.some(tag => tag.toLowerCase() === interest.toLowerCase())
      );

      const matchesLocation = preferences.preferredLocations.some(location =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );

      const matchesBudget = (() => {
        switch (preferences.budget) {
          case 'low':
            return event.price <= 20;
          case 'medium':
            return event.price > 20 && event.price <= 50;
          case 'high':
            return event.price > 50;
          default:
            return true;
        }
      })();

      const matchesDistance = !event.coordinates || 
        calculateDistance(event.coordinates, userPreferences!.travelDistance);

      return matchesInterests && matchesLocation && matchesBudget && matchesDistance;
    }).sort((a, b) => {
      const scoreA = calculateEventScore(a, preferences);
      const scoreB = calculateEventScore(b, preferences);
      return scoreB - scoreA;
    });
  };

  const calculateDistance = (coordinates: { lat: number, lng: number }, maxDistance: number): boolean => {
    return true;
  };

  const calculateEventScore = (event: Event, preferences: QuestionnaireResponse): number => {
    let score = 0;

    preferences.interests.forEach(interest => {
      if (event.category.toLowerCase() === interest.toLowerCase()) score += 3;
      if (event.tags?.some(tag => tag.toLowerCase() === interest.toLowerCase())) score += 2;
    });

    if (preferences.preferredLocations.some(loc => 
      event.location.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 2;
    }

    const eventPrice = event.price;
    switch (preferences.budget) {
      case 'low':
        if (eventPrice <= 20) score += 2;
        break;
      case 'medium':
        if (eventPrice > 20 && eventPrice <= 50) score += 2;
        break;
      case 'high':
        if (eventPrice > 50) score += 2;
        break;
    }

    return score;
  };

  const handleQuestionnaireComplete = (responses: QuestionnaireResponse) => {
    localStorage.setItem('hasCompletedQuestionnaire', 'true');
    localStorage.setItem('questionnaireResponses', JSON.stringify(responses));
    setShowQuestionnaire(false);
    setHasCompletedQuestionnaire(true);
    setUserPreferences(responses);
    success('Profil personnalisé', 'Vos préférences ont été enregistrées avec succès !');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                What's The Event Today?
                {userName && <span className="ml-2">Hello, {userName}!</span>}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Où vous voulez, quand vous voulez
              </p>
            </div>

            {recommendedEvents.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 font-roboto dark:text-white">
                  Recommandés pour vous
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedEvents.slice(0, 3).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                      isFavorite={favoriteEvents.has(event.id)}
                      onFavoriteToggle={() => handleFavoriteToggle(event.id)}
                      onShare={() => handleEventShare(event)}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="mb-16">
              <EventCarousel events={premiumEvents} onEventClick={handleEventClick} />
            </section>

            <section className="mb-16">
              <SearchBar onSearch={handleSearch} />
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 font-roboto dark:text-white">Offres Spéciales</h2>
              <SpecialOffersSection offers={specialOffers} onEventClick={handleEventClick} />
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 font-roboto dark:text-white">Tendances</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    isFavorite={favoriteEvents.has(event.id)}
                    onFavoriteToggle={() => handleFavoriteToggle(event.id)}
                    onShare={() => handleEventShare(event)}
                  />
                ))}
              </div>
            </section>
          </div>
        );
      case 'search':
        return <SearchPage onEventClick={handleEventClick} />;
      case 'detail':
        return selectedEvent ? (
          <EventDetailPage
            event={selectedEvent}
            onBack={() => setCurrentPage('home')}
          />
        ) : null;
      case 'settings':
        return <SettingsPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications-settings':
        return <NotificationsSettingsPage />;
      default:
        return null;
    }
  };

  return (
    <Layout 
      onSearch={handleSearch}
      onNavigate={(page) => setCurrentPage(page as any)}
      currentPage={currentPage}
    >
      {showQuestionnaire && (
        <QuestionnaireModal
          isOpen={showQuestionnaire}
          onClose={handleSkipQuestionnaire}
          onComplete={handleQuestionnaireComplete}
        />
      )}
      
      {renderPage()}
      
      <FloatingActionButton
        onShowCalendar={() => info('Calendrier', 'Fonctionnalité bientôt disponible')}
        onShowMap={() => info('Carte', 'Fonctionnalité bientôt disponible')}
        onShowFavorites={() => {
          const favoriteEventsList = [...premiumEvents, ...trendingEvents].filter(e => favoriteEvents.has(e.id));
          info('Favoris', `Vous avez ${favoriteEventsList.length} événement(s) en favoris`);
        }}
        onShare={() => handleEventShare(premiumEvents[0])}
        onFilter={() => setCurrentPage('search')}
      />
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
}

export default App;