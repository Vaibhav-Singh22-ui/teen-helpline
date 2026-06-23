export interface Profile {
  id: string;
  display_name: string | null;
  buddy_name: string;
  buddy_avatar: string;
  buddy_personality: string;
  points: number;
  created_at: string;
}

export interface MoodHistory {
  id: string;
  user_id: string | null;
  mood: string;
  stress_level: number;
  sleep_quality: number;
  goal_completed: boolean;
  checkin_date: string;
  created_at: string;
}

export interface CounselorBooking {
  id: string;
  user_id: string | null;
  counselor_name: string;
  counselor_photo: string;
  counselor_expertise: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  session_type: 'text' | 'audio' | 'video';
  created_at?: string;
}

export interface CommunityPost {
  id: string;
  author_pseudonym: string;
  content: string;
  mood_tag: string | null;
  likes: number;
  created_at: string;
  expires_at: string;
}

export interface CommunityReply {
  id: string;
  post_id: string;
  author_pseudonym: string;
  content: string;
  created_at: string;
}

export interface SafeJournal {
  id: string;
  user_id: string | null;
  content: string;
  mood: string | null;
  buddy_reflection: string | null;
  created_at: string;
}

export interface SleepLog {
  id: string;
  user_id: string | null;
  duration_hours: number;
  quality: number; // 1-5
  log_date: string;
}

export interface Goal {
  id: string;
  user_id: string | null;
  title: string;
  target_date: string;
  completed: boolean;
  frequency: 'daily' | 'weekly';
}
