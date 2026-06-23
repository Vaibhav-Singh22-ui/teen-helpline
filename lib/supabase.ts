import { createClient } from '@supabase/supabase-js';
import { Profile, MoodHistory, CounselorBooking, CommunityPost, CommunityReply, SafeJournal, Goal } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helpers to check if we should fallback to localStorage
const isOnline = () => {
  return supabase !== null;
};

// --- LOCAL STORAGE MOCK DATA SEEDS ---
const MOCK_COUNSELORS = [
  {
    id: 'c1',
    name: 'Dr. Ananya Sen',
    expertise: 'Exam Stress & Anxiety Specialist',
    experience: '8 years',
    availability: 'Available Today',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    verification: true
  },
  {
    id: 'c2',
    name: 'Rahul Sharma',
    expertise: 'Student Mentor & Bullying Support',
    experience: '5 years',
    availability: 'Available Tomorrow',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    verification: true
  },
  {
    id: 'c3',
    name: 'Pooja Nair',
    expertise: 'Family Dynamics & Relationship Coach',
    experience: '12 years',
    availability: 'Slots available',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200',
    verification: true
  }
];

const MOCK_SUCCESS_STORIES = [
  {
    id: 1,
    title: 'From Exam Panic to Calm Focus',
    story: 'I used to get panic attacks before my board exams. The breathing exercises in the Calm Zone and daily chats with Buddy helped me organize my revision and manage my panic. Scored 92% and felt calm throughout!',
    age: 16,
    mood: 'Stressed',
    counselor_helped: 'Dr. Ananya Sen'
  },
  {
    id: 2,
    title: 'Finding Voice Against Bullying',
    story: 'After moving to a new school, I was bullied online. I felt lonely and had zero self-esteem. Posting anonymously in the community made me realize others face this too. Rahul sir guided me on how to report it and build confidence.',
    age: 15,
    mood: 'Lonely',
    counselor_helped: 'Rahul Sharma'
  },
  {
    id: 3,
    title: 'Reconnecting with Family',
    story: 'My parents and I argued constantly about my career. Through audio counseling sessions, Pooja Nair helped us communicate calmly. Now they understand my interest in design, and we have weekly game nights.',
    age: 17,
    mood: 'Angry',
    counselor_helped: 'Pooja Nair'
  }
];

// Helper to initialize local storage if empty
const initLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem('th_posts')) {
    const initialPosts: CommunityPost[] = [
      {
        id: 'p1',
        author_pseudonym: 'SilentFeather',
        content: 'Super stressed about the upcoming mock tests. Feels like my whole life depends on these marks and my parents won\'t accept anything less than a 95%. How is everyone coping?',
        mood_tag: 'Stressed',
        likes: 12,
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        expires_at: new Date(Date.now() + 5 * 86400000).toISOString()
      },
      {
        id: 'p2',
        author_pseudonym: 'CloudDrifter',
        content: 'Felt so lonely today at lunch, sat by myself near the library. It seems like everyone else has their groups figured out already. If anyone wants to talk, I am here.',
        mood_tag: 'Lonely',
        likes: 24,
        created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
        expires_at: new Date(Date.now() + 6 * 86400000).toISOString()
      },
      {
        id: 'p3',
        author_pseudonym: 'OceanBreeze',
        content: 'Just tried the Bubble Burst game in the Calm Zone. Genuinely popped bubbles for 10 minutes and felt my anxiety go from a 9/10 to a 4/10. Definitely recommend checking it out!',
        mood_tag: 'Anxious',
        likes: 8,
        created_at: new Date(Date.now() - 15 * 3600000).toISOString(),
        expires_at: new Date(Date.now() + 4 * 86400000).toISOString()
      }
    ];
    localStorage.setItem('th_posts', JSON.stringify(initialPosts));
  }

  if (!localStorage.getItem('th_replies')) {
    const initialReplies: CommunityReply[] = [
      {
        id: 'r1',
        post_id: 'p1',
        author_pseudonym: 'Wanderer99',
        content: 'Hey, I feel you. Just remember, marks don\'t define your value. Try taking 10-minute breaks every hour, it really helps to stay focused.',
        created_at: new Date(Date.now() - 1 * 3600000).toISOString()
      },
      {
        id: 'r2',
        post_id: 'p1',
        author_pseudonym: 'SunnySide',
        content: 'You got this! Talk to Buddy, he gave me some really cool study schedules that helped reduce my exam stress.',
        created_at: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        id: 'r3',
        post_id: 'p2',
        author_pseudonym: 'KindSoul',
        content: 'Libraries are actually the best spots! If you like reading, try joining a school book club, it is a low-pressure way to make friends.',
        created_at: new Date(Date.now() - 8 * 3600000).toISOString()
      }
    ];
    localStorage.setItem('th_replies', JSON.stringify(initialReplies));
  }

  if (!localStorage.getItem('th_goals')) {
    const initialGoals: Goal[] = [
      { id: 'g1', user_id: 'guest', title: 'Complete 5-min Breathing Orbit', target_date: new Date().toISOString(), completed: false, frequency: 'daily' },
      { id: 'g2', user_id: 'guest', title: 'Write in Safe Journal', target_date: new Date().toISOString(), completed: false, frequency: 'daily' },
      { id: 'g3', user_id: 'guest', title: 'Get 8 hours of sleep', target_date: new Date().toISOString(), completed: false, frequency: 'daily' }
    ];
    localStorage.setItem('th_goals', JSON.stringify(initialGoals));
  }

  if (!localStorage.getItem('th_profile')) {
    const initialProfile: Profile = {
      id: 'guest',
      display_name: 'Guest Buddy',
      buddy_name: 'Buddy',
      buddy_avatar: 'avatar1',
      buddy_personality: 'Cheerful',
      points: 15,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('th_profile', JSON.stringify(initialProfile));
  }

  if (!localStorage.getItem('th_bookings')) {
    localStorage.setItem('th_bookings', JSON.stringify([]));
  }

  if (!localStorage.getItem('th_journals')) {
    localStorage.setItem('th_journals', JSON.stringify([]));
  }

  if (!localStorage.getItem('th_moods')) {
    const initialMoods: MoodHistory[] = [
      { id: 'm1', user_id: 'guest', mood: 'Stressed', stress_level: 4, sleep_quality: 3, goal_completed: false, checkin_date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: 'm2', user_id: 'guest', mood: 'Lonely', stress_level: 3, sleep_quality: 4, goal_completed: true, checkin_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 'm3', user_id: 'guest', mood: 'Anxious', stress_level: 5, sleep_quality: 2, goal_completed: false, checkin_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: 'm4', user_id: 'guest', mood: 'Calm', stress_level: 2, sleep_quality: 5, goal_completed: true, checkin_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: 'm5', user_id: 'guest', mood: 'Happy', stress_level: 1, sleep_quality: 5, goal_completed: true, checkin_date: new Date().toISOString().split('T')[0], created_at: new Date().toISOString() }
    ];
    localStorage.setItem('th_moods', JSON.stringify(initialMoods));
  }
};

// Database Service layer that abstracts Supabase / LocalStorage
export const dbService = {
  initialize: () => {
    initLocalStorage();
  },

  // Profile operations
  getProfile: async (userId: string = 'guest'): Promise<Profile> => {
    initLocalStorage();
    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) return data as Profile;
    }
    const profile = localStorage.getItem('th_profile');
    return profile ? JSON.parse(profile) : {
      id: 'guest',
      display_name: 'Guest Buddy',
      buddy_name: 'Buddy',
      buddy_avatar: 'avatar1',
      buddy_personality: 'Cheerful',
      points: 15,
      created_at: new Date().toISOString()
    };
  },

  updateProfile: async (profile: Partial<Profile>, userId: string = 'guest'): Promise<Profile> => {
    initLocalStorage();
    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('profiles').update(profile).eq('id', userId).select().single();
      if (!error && data) return data as Profile;
    }
    const current = await dbService.getProfile(userId);
    const updated = { ...current, ...profile };
    localStorage.setItem('th_profile', JSON.stringify(updated));
    return updated;
  },

  addPoints: async (amount: number, userId: string = 'guest'): Promise<number> => {
    const profile = await dbService.getProfile(userId);
    const newPoints = profile.points + amount;
    await dbService.updateProfile({ points: newPoints }, userId);
    return newPoints;
  },

  // Mood history operations
  getMoodHistory: async (userId: string = 'guest'): Promise<MoodHistory[]> => {
    initLocalStorage();
    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('mood_history').select('*').eq('user_id', userId).order('checkin_date', { ascending: true });
      if (!error && data) return data as MoodHistory[];
    }
    const moods = localStorage.getItem('th_moods');
    return moods ? JSON.parse(moods) : [];
  },

  addMoodCheckin: async (mood: string, stress: number, sleep: number, goalCompleted: boolean = false, userId: string = 'guest'): Promise<MoodHistory> => {
    initLocalStorage();
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: MoodHistory = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId === 'guest' ? null : userId,
      mood,
      stress_level: stress,
      sleep_quality: sleep,
      goal_completed: goalCompleted,
      checkin_date: todayStr,
      created_at: new Date().toISOString()
    };

    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('mood_history').insert({
        user_id: userId,
        mood,
        stress_level: stress,
        sleep_quality: sleep,
        goal_completed: goalCompleted,
        checkin_date: todayStr
      }).select().single();
      if (!error && data) return data as MoodHistory;
    }

    const current = await dbService.getMoodHistory(userId);
    // Remove if checkin already exists for today
    const filtered = current.filter(m => m.checkin_date !== todayStr);
    filtered.push(newEntry);
    localStorage.setItem('th_moods', JSON.stringify(filtered));
    return newEntry;
  },

  // Counselor bookings operations
  getBookings: async (userId: string = 'guest'): Promise<CounselorBooking[]> => {
    initLocalStorage();
    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('counselor_bookings').select('*').eq('user_id', userId).order('appointment_time', { ascending: true });
      if (!error && data) return data as CounselorBooking[];
    }
    const bookings = localStorage.getItem('th_bookings');
    return bookings ? JSON.parse(bookings) : [];
  },

  addBooking: async (booking: Omit<CounselorBooking, 'id'>, userId: string = 'guest'): Promise<CounselorBooking> => {
    initLocalStorage();
    const newBooking: CounselorBooking = {
      ...booking,
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId === 'guest' ? null : userId
    };

    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('counselor_bookings').insert({
        user_id: userId,
        counselor_name: booking.counselor_name,
        counselor_photo: booking.counselor_photo,
        counselor_expertise: booking.counselor_expertise,
        appointment_time: booking.appointment_time,
        status: booking.status,
        session_type: booking.session_type
      }).select().single();
      if (!error && data) return data as CounselorBooking;
    }

    const current = await dbService.getBookings(userId);
    current.push(newBooking);
    localStorage.setItem('th_bookings', JSON.stringify(current));
    return newBooking;
  },

  // Community post operations (expires in 7 days)
  getCommunityPosts: async (): Promise<CommunityPost[]> => {
    initLocalStorage();
    if (isOnline()) {
      const { data, error } = await supabase!
        .from('community_posts')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      if (!error && data) return data as CommunityPost[];
    }
    const posts = localStorage.getItem('th_posts');
    const parsed: CommunityPost[] = posts ? JSON.parse(posts) : [];
    // Filter expired posts
    const now = new Date().getTime();
    return parsed.filter(p => new Date(p.expires_at).getTime() > now);
  },

  addCommunityPost: async (authorPseudonym: string, content: string, moodTag: string | null): Promise<CommunityPost> => {
    initLocalStorage();
    const newPost: CommunityPost = {
      id: Math.random().toString(36).substring(2, 11),
      author_pseudonym: authorPseudonym,
      content,
      mood_tag: moodTag,
      likes: 0,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString()
    };

    if (isOnline()) {
      const { data, error } = await supabase!.from('community_posts').insert({
        author_pseudonym: authorPseudonym,
        content,
        mood_tag: moodTag
      }).select().single();
      if (!error && data) return data as CommunityPost;
    }

    const current = await dbService.getCommunityPosts();
    current.unshift(newPost);
    localStorage.setItem('th_posts', JSON.stringify(current));
    return newPost;
  },

  likePost: async (postId: string): Promise<number> => {
    initLocalStorage();
    if (isOnline()) {
      // Direct call
      const { data, error } = await supabase!.rpc('increment_likes', { post_id: postId });
      if (!error && data) return data;
      // Fallback manual update
      const { data: selectData } = await supabase!.from('community_posts').select('likes').eq('id', postId).single();
      if (selectData) {
        const newLikes = (selectData.likes || 0) + 1;
        await supabase!.from('community_posts').update({ likes: newLikes }).eq('id', postId);
        return newLikes;
      }
    }
    const postsStr = localStorage.getItem('th_posts');
    if (postsStr) {
      const posts: CommunityPost[] = JSON.parse(postsStr);
      const idx = posts.findIndex(p => p.id === postId);
      if (idx !== -1) {
        posts[idx].likes += 1;
        localStorage.setItem('th_posts', JSON.stringify(posts));
        return posts[idx].likes;
      }
    }
    return 0;
  },

  getPostReplies: async (postId: string): Promise<CommunityReply[]> => {
    initLocalStorage();
    if (isOnline()) {
      const { data, error } = await supabase!
        .from('community_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (!error && data) return data as CommunityReply[];
    }
    const repliesStr = localStorage.getItem('th_replies');
    const replies: CommunityReply[] = repliesStr ? JSON.parse(repliesStr) : [];
    return replies.filter(r => r.post_id === postId);
  },

  addPostReply: async (postId: string, authorPseudonym: string, content: string): Promise<CommunityReply> => {
    initLocalStorage();
    const newReply: CommunityReply = {
      id: Math.random().toString(36).substring(2, 11),
      post_id: postId,
      author_pseudonym: authorPseudonym,
      content,
      created_at: new Date().toISOString()
    };

    if (isOnline()) {
      const { data, error } = await supabase!.from('community_replies').insert({
        post_id: postId,
        author_pseudonym: authorPseudonym,
        content
      }).select().single();
      if (!error && data) return data as CommunityReply;
    }

    const currentStr = localStorage.getItem('th_replies');
    const current: CommunityReply[] = currentStr ? JSON.parse(currentStr) : [];
    current.push(newReply);
    localStorage.setItem('th_replies', JSON.stringify(current));
    return newReply;
  },

  // Safe Space Journal
  getJournalEntries: async (userId: string = 'guest'): Promise<SafeJournal[]> => {
    initLocalStorage();
    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('safe_journal').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return data as SafeJournal[];
    }
    const journals = localStorage.getItem('th_journals');
    return journals ? JSON.parse(journals) : [];
  },

  addJournalEntry: async (content: string, mood: string | null, buddyReflection: string | null, userId: string = 'guest'): Promise<SafeJournal> => {
    initLocalStorage();
    const newJournal: SafeJournal = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId === 'guest' ? null : userId,
      content,
      mood,
      buddy_reflection: buddyReflection,
      created_at: new Date().toISOString()
    };

    if (isOnline() && userId !== 'guest') {
      const { data, error } = await supabase!.from('safe_journal').insert({
        user_id: userId,
        content,
        mood,
        buddy_reflection: buddyReflection
      }).select().single();
      if (!error && data) return data as SafeJournal;
    }

    const current = await dbService.getJournalEntries(userId);
    current.unshift(newJournal);
    localStorage.setItem('th_journals', JSON.stringify(current));
    return newJournal;
  },

  // Goals
  getGoals: async (userId: string = 'guest'): Promise<Goal[]> => {
    initLocalStorage();
    const goalsStr = localStorage.getItem('th_goals');
    return goalsStr ? JSON.parse(goalsStr) : [];
  },

  toggleGoal: async (goalId: string, userId: string = 'guest'): Promise<Goal[]> => {
    initLocalStorage();
    const current = await dbService.getGoals(userId);
    const updated = current.map(g => {
      if (g.id === goalId) {
        return { ...g, completed: !g.completed };
      }
      return g;
    });
    localStorage.setItem('th_goals', JSON.stringify(updated));
    return updated;
  },

  addCustomGoal: async (title: string, frequency: 'daily' | 'weekly', userId: string = 'guest'): Promise<Goal> => {
    initLocalStorage();
    const newGoal: Goal = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      title,
      target_date: new Date().toISOString(),
      completed: false,
      frequency
    };
    const current = await dbService.getGoals(userId);
    current.push(newGoal);
    localStorage.setItem('th_goals', JSON.stringify(current));
    return newGoal;
  },

  // Helpers for Counselors & Stories
  getCounselorsList: () => MOCK_COUNSELORS,
  getSuccessStories: () => MOCK_SUCCESS_STORIES
};
