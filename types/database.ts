export type EventCategory =
  | "general"
  | "youth"
  | "kesha"
  | "conference"
  | "revival"
  | "crusade"
  | "wedding"
  | "funeral"
  | "training";

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  event_date: string;       // YYYY-MM-DD
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  flyer_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  link_label: string;
  is_active: boolean;
  severity: "info" | "urgent" | "celebration";
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string | null;
  sermon_date: string;
  scripture_reference: string | null;
  video_url: string | null;
  audio_url: string | null;
  notes_pdf_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: 1;
  bishop_weekly_word: string;
  bishop_word_updated_at: string;
  sunday_service_1: string;
  sunday_service_2: string;
  wednesday_service: string;
  friday_service: string;
  church_address: string;
  church_phone_1: string;
  church_phone_2: string | null;
  church_email: string;
  paybill_number: string;
  paybill_account_label: string;
  latitude: number;
  longitude: number;
  livestream_url: string | null;
  next_service_datetime: string | null;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}
