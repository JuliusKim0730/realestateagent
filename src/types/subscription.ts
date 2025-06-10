export interface SubscriptionType {
  area_type: string;
  supply_area: number;
  exclusive_area: number;
  supply_count: number;
  price: number;
}

export interface Subscription {
  id: string;
  house_name: string;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  subscription_start_date?: string;
  subscription_end_date: string;
  winner_announcement_date?: string;
  total_supply_count: number;
  constructor?: string;
  agency?: string;
  min_price?: number;
  max_price?: number;
  types?: SubscriptionType[];
}

export interface CalendarEvent {
  id: string;
  house_name: string;
  event_type: 'start' | 'end' | 'announcement';
  subscription_end_date: string;
}

export interface CalendarData {
  [date: string]: CalendarEvent[];
}

export interface SearchParams {
  region?: string;
  minPrice?: number;
  maxPrice?: number;
} 