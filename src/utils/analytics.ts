interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled: boolean = true;

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    console.log('Analytics Event:', event);
    
    // Here you would integrate with your analytics service
    // Examples: Firebase Analytics, Mixpanel, Amplitude, etc.
  }

  // Event tracking methods
  trackEventView(eventId: string, eventTitle: string) {
    this.track({
      name: 'event_view',
      parameters: {
        event_id: eventId,
        event_title: eventTitle,
      },
    });
  }

  trackEventShare(eventId: string, method: string) {
    this.track({
      name: 'event_share',
      parameters: {
        event_id: eventId,
        method,
      },
    });
  }

  trackEventFavorite(eventId: string, action: 'add' | 'remove') {
    this.track({
      name: 'event_favorite',
      parameters: {
        event_id: eventId,
        action,
      },
    });
  }

  trackReservation(eventId: string, ticketCount: number, totalPrice: number) {
    this.track({
      name: 'reservation_made',
      parameters: {
        event_id: eventId,
        ticket_count: ticketCount,
        total_price: totalPrice,
      },
    });
  }

  trackSearch(query: string, filters?: any) {
    this.track({
      name: 'search',
      parameters: {
        query,
        filters,
      },
    });
  }

  trackScreenView(screenName: string) {
    this.track({
      name: 'screen_view',
      parameters: {
        screen_name: screenName,
      },
    });
  }

  trackUserAction(action: string, context?: string) {
    this.track({
      name: 'user_action',
      parameters: {
        action,
        context,
      },
    });
  }

  // User properties
  setUserProperty(name: string, value: any) {
    if (!this.isEnabled) return;

    console.log('User Property:', { name, value });
    
    // Here you would set user properties in your analytics service
  }

  setUserId(userId: string) {
    if (!this.isEnabled) return;

    console.log('User ID:', userId);
    
    // Here you would set the user ID in your analytics service
  }
}

export default new AnalyticsService();