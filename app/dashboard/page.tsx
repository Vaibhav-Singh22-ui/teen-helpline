'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, BookOpen, Heart, Award, Calendar, Clock, Trash2, 
  CheckCircle2, AlertCircle, X, ChevronRight, Plus, Send, Lock, 
  User, ExternalLink, Book, CheckSquare, Smile, ShoppingCart, Menu,
  LayoutDashboard, Users, Settings, Bell, Search, RotateCcw, Compass,
  SlidersHorizontal, Star, LogOut
} from 'lucide-react';
import { dbService } from '../../lib/supabase';
import { Profile, CounselorBooking, SafeJournal, Goal } from '../../lib/types';

// Mock Tutors and Counselors matching the requirements
const MOCK_TUTORS = [
  {
    id: 't1',
    name: 'Vivek Gupta',
    expertise: 'IIT Mathematics & Physics Specialist',
    experience: '6 years',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    subject: 'Math & Physics',
    mode: 'Tuition Class',
    price: 499, // price per session if booking individually
    grades: ['Class 11th', 'Class 12th']
  },
  {
    id: 't2',
    name: 'Priyanka Sen',
    expertise: 'Computer Science & Python coding mentor',
    experience: '4 years',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    subject: 'Coding & Comp Sci',
    mode: 'Tuition Class',
    price: 399,
    grades: ['Class 8th', 'Class 9th', 'Class 10th']
  },
  {
    id: 't3',
    name: 'Dr. Anisha Rao',
    expertise: 'Career Guidance & College Stream Advisor',
    experience: '10 years',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200',
    subject: 'Career Counselling',
    mode: 'Guidance Session',
    price: 599,
    grades: ['Class 10th', 'Class 11th', 'Class 12th']
  },
  {
    id: 't4',
    name: 'Sanjana Roy',
    expertise: 'CBSE English Literature & Essay Writer',
    experience: '3 years',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    subject: 'English & Arts',
    mode: 'Tuition Class',
    price: 299,
    grades: ['Class 11th', 'Class 12th']
  },
  {
    id: 't5',
    name: 'Amit Verma',
    expertise: 'Science, Biology & Chemistry Mentor',
    experience: '5 years',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    subject: 'Science & Chemistry',
    mode: 'Tuition Class',
    price: 349,
    grades: ['Class 8th', 'Class 9th', 'Class 10th']
  },
  {
    id: 't6',
    name: 'Meera Nair',
    expertise: 'CBSE / ICSE Board Exam Preparation Coach',
    experience: '8 years',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    subject: 'Board Physics & Math',
    mode: 'Tuition Class',
    price: 450,
    grades: ['Class 10th', 'Class 12th']
  }
];

// Mock Wellness Courses
const WELLNESS_COURSES = [
  {
    id: 'wc1',
    title: 'Overcoming Exam Panic',
    counselor: 'Dr. Anisha Rao',
    category: 'Anxiety Control',
    chapters: 4,
    image: '/media__1782218276419.png',
    description: 'Learn physiological breathing techniques, self-talk switches, and optimal study timing structures to completely defeat mock test anxiety.',
    grades: ['Class 10th', 'Class 12th', 'Class 11th', 'Class 9th', 'Class 8th'],
    syllabus: [
      { title: 'Understanding Amygdala Hijack', content: 'Mock tests feel like life-or-death threats because your brain\'s emotional alarm (the amygdala) overrides logic. When panic hits, your heart rate spikes and memory goes offline. Recognizing this is normal physiology is your first step. Stop, put your pen down, and exhale slowly.' },
      { title: 'The Box Breathing Safeguard', content: 'Force your nervous system into safety. Breathe in for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds. Repeat 3 times. This tells the brain there is no physical danger.' },
      { title: 'Defeating the "What Ifs"', content: 'Anxiety talks in catastrophic predictions ("What if I fail?"). Challenge these. Write down: "Mock marks are diagnostic tools, not predictions of my value. I am building skills daily."' },
      { title: 'Creating a Focus Schedule', content: 'Break subjects into 25-minute sprints followed by 5 minutes of absolute offline rest. No phone screens during rest. Rest your eyes to let your memory consolidate.' }
    ]
  },
  {
    id: 'wc2',
    title: 'Social Confidence & Self-Esteem',
    counselor: 'Rahul Sharma',
    category: 'Relationships',
    chapters: 3,
    image: '/media__1782218276491.png',
    description: 'A structural guide to building confidence, handling social groups, reporting digital bullying, and establishing personal boundary lines.',
    grades: ['Class 8th', 'Class 9th', 'Class 10th', 'Class 11th', 'Class 12th'],
    syllabus: [
      { title: 'Your Nickname is a Shield', content: 'Anonymous platforms are safe spaces to share because they prevent personal judgment. In real life, you don\'t need approval from every social circle. Focus on a few friends who listen.' },
      { title: 'Digital Boundary Mapping', content: 'Social media notifications fragment our attention and trigger comparison fatigue. Turn off notifications after 8:00 PM. You are in control of who has access to your space.' },
      { title: 'Handling Group Friction', content: 'Friend groups drift and conflicts occur. State your feelings calmly ("I felt left out when X happened"). If they ignore your boundaries, it is completely okay to seek new connections.' }
    ]
  },
  {
    id: 'wc3',
    title: 'Stream Selection & Future Pathways',
    counselor: 'Dr. Anisha Rao',
    category: 'Career Guidance',
    chapters: 3,
    image: '/media__1782218276491.png',
    description: 'Feeling confused about selecting Science, Commerce, or Arts? Learn to map your personality markers directly to stream structures.',
    grades: ['Class 10th', 'Class 11th'],
    syllabus: [
      { title: 'Mapping Your Natural Strengths', content: 'Do you prefer solving structural problems, writing creative essays, or analyzing business numbers? Identifying your cognitive playstyle is the first step in stream mapping.' },
      { title: 'Exploring the 3 Streams', content: 'Science offers engineering & medicine, Commerce details finance & entrepreneurship, and Humanities/Arts builds design, law, & social policy. All are equally valuable in today\'s world.' },
      { title: 'Decision Frameworks', content: 'Do not choose a stream because of peer pressure or parent wishes. Discuss with a mentor, try out basic mock projects, and choose where your curiosity lies.' }
    ]
  }
];

// Mock Subscription Plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_free',
    name: 'Free Trial Support',
    price: 0,
    period: 'Once',
    features: [
      '1 Free subject tuition slot',
      'Public community group access',
      'Daily basic habit tracker',
      'Anonymous safe journal logs'
    ],
    badge: 'Starter',
    popular: false
  },
  {
    id: 'plan_growth',
    name: 'Growth Core Package',
    price: 1499,
    period: 'month',
    features: [
      '5 Academic tuition classes/mo',
      '1 Private counseling session/mo',
      'Full wellness course enrollment',
      'Double points for wellness checklists',
      'Private mentor support line'
    ],
    badge: 'Most Popular',
    popular: true
  },
  {
    id: 'plan_board',
    name: 'Board Exam Shield',
    price: 3999,
    period: 'month',
    features: [
      'Unlimited tuition classes/mo',
      'Weekly career mentoring sessions',
      'Personal stress-coach hotline',
      'Guaranteed slots with premium tutors',
      'Parent-student feedback loops'
    ],
    badge: 'Exam Shield',
    popular: false
  }
];

export default function Dashboard() {
  const router = useRouter();
  
  // Dashboard Navigation Tab State (Left Sidebar tabs)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-courses' | 'marketplace' | 'mentors' | 'cart' | 'settings'>('marketplace');
  const [dashMobileOpen, setDashMobileOpen] = useState(false);

  // DiceBear Avatar Seed State
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  
  // Search & Filters for Learning Marketplace
  const [searchQuery, setSearchQuery] = useState('');
  const [marketType, setMarketType] = useState<'teachers' | 'counselors'>('teachers');
  const [marketPrice, setMarketPrice] = useState<string>('All');
  const [marketDate, setMarketDate] = useState<string>('');
  
  // Grade Filter
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  // Interactive Database States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<CounselorBooking[]>([]);
  const [journals, setJournals] = useState<SafeJournal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // Habits & Journal Form states
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState('Calm');
  const [journalLoading, setJournalLoading] = useState(false);

  // Booking details for added slots
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('16:00');
  const [bookingType, setBookingType] = useState<'text' | 'audio' | 'video'>('video');

  // Interactive Wellness Course viewer states
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [courseCompletedMsg, setCourseCompletedMsg] = useState('');

  // Shopping Cart state
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Load Dashboard Data
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('th_logged_in') === 'true';
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }

    dbService.initialize();
    loadDashboardData();

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);

    // Load cart from localStorage
    const savedCart = localStorage.getItem('th_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const loadDashboardData = async () => {
    const userId = 'user123'; // Demo User ID
    const prof = await dbService.getProfile(userId);
    const books = await dbService.getBookings(userId);
    const jrnls = await dbService.getJournalEntries(userId);
    const gls = await dbService.getGoals(userId);

    setProfile(prof);
    setBookings(books);
    setJournals(jrnls);
    setGoals(gls);

    const savedSeed = localStorage.getItem('th_avatar_seed');
    if (savedSeed) {
      setAvatarSeed(savedSeed);
    } else {
      const defaultSeed = prof?.display_name || 'Alex';
      setAvatarSeed(defaultSeed);
      localStorage.setItem('th_avatar_seed', defaultSeed);
    }
  };

  // Cart operations
  const saveCart = (updatedCart: any[]) => {
    setCart(updatedCart);
    localStorage.setItem('th_cart', JSON.stringify(updatedCart));
  };

  const addToCart = (item: any) => {
    // Prevent duplicate pricing plans
    if (item.type === 'plan' && cart.some(c => c.id === item.id)) {
      alert(`${item.name} is already in your cart!`);
      return;
    }
    
    const updated = [...cart, item];
    saveCart(updated);
    alert(`🛒 Added to Cart: ${item.name}`);
  };

  const removeFromCart = (itemId: string) => {
    const updated = cart.filter(c => c.cartId !== itemId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const handleBookTutorClick = (tutor: any) => {
    setSelectedTutor(tutor);
  };

  // Add specific tutor slot to Cart
  const handleAddBookingToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor) return;

    const cartId = Math.random().toString(36).substring(2, 9);
    const formattedDate = new Date(`${bookingDate}T${bookingTime}:00`);
    
    const cartItem = {
      cartId,
      id: selectedTutor.id,
      name: `${selectedTutor.name} - ${selectedTutor.subject}`,
      price: selectedTutor.price,
      type: 'tuition',
      photo: selectedTutor.photo,
      details: `${selectedTutor.mode} (${bookingType.toUpperCase()}) on ${formattedDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${bookingTime}`,
      bookingDetails: {
        counselor_name: selectedTutor.name,
        counselor_photo: selectedTutor.photo,
        counselor_expertise: `${selectedTutor.subject} (${selectedTutor.mode})`,
        appointment_time: formattedDate.toISOString(),
        session_type: bookingType
      }
    };

    addToCart(cartItem);
    setSelectedTutor(null);
  };

  // Checkout Shopping Cart
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Save scheduled sessions from cart
    for (const item of cart) {
      if (item.type === 'tuition' && item.bookingDetails) {
        await dbService.addBooking(item.bookingDetails, 'user123');
      }
    }

    // Award check-out points
    await dbService.addPoints(25, 'user123');
    window.dispatchEvent(new Event('profileUpdated'));
    
    setCheckoutSuccess(true);
    clearCart();
    loadDashboardData();
  };

  // Sign out flow
  const handleSignOut = () => {
    localStorage.removeItem('th_logged_in');
    window.dispatchEvent(new Event('profileUpdated'));
    router.push('/');
  };

  // Private Journal reflection submit
  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    setJournalLoading(true);
    const text = journalContent.toLowerCase();
    let reflection = '';

    if (text.includes('exam') || text.includes('math') || text.includes('physics') || text.includes('marks') || text.includes('tuition')) {
      reflection = "Study stress is heavy, dost. Remember to divide topics into micro-tasks. You can find specialized Class 8th-12th tutors right here in the dashboard to help you clear doubts.";
    } else if (text.includes('lonely') || text.includes('sad') || text.includes('crying')) {
      reflection = "I hear you, and it's completely okay to feel down. You are building resilience every day. Take some time off, and perhaps try a breathing activity in the Calm Zone.";
    } else if (text.includes('friend') || text.includes('fight') || text.includes('ignored')) {
      reflection = "Navigating friendships and high-school circles is tough. Speak from the heart, but respect your own space and energy first.";
    } else {
      reflection = "Thank you for writing in your private space. Remember, you don't have to carry all burden alone. Buddy is always listening.";
    }

    try {
      await dbService.addJournalEntry(journalContent.trim(), journalMood, reflection, 'user123');
      await dbService.addPoints(10, 'user123');
      setJournalContent('');
      await loadDashboardData();
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      console.error(err);
    } finally {
      setJournalLoading(false);
    }
  };

  // Goals completion toggler
  const handleToggleGoal = async (goalId: string) => {
    const nextGoals = await dbService.toggleGoal(goalId, 'user123');
    setGoals(nextGoals);

    const target = nextGoals.find(g => g.id === goalId);
    if (target?.completed) {
      await dbService.addPoints(5, 'user123');
      window.dispatchEvent(new Event('profileUpdated'));
      loadDashboardData();
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    await dbService.addCustomGoal(newGoalTitle.trim(), 'daily', 'user123');
    setNewGoalTitle('');
    loadDashboardData();
  };

  // Course syllabus reading chapter navigator
  const handleFinishChapter = async () => {
    if (!activeCourse) return;
    if (activeChapterIndex < activeCourse.syllabus.length - 1) {
      setActiveChapterIndex(prev => prev + 1);
    } else {
      await dbService.addPoints(20, 'user123');
      window.dispatchEvent(new Event('profileUpdated'));
      loadDashboardData();
      setCourseCompletedMsg('🎉 Lesson completed successfully! You earned +20 wellness points.');
      setTimeout(() => {
        setCourseCompletedMsg('');
        setActiveCourse(null);
        setActiveChapterIndex(0);
      }, 3500);
    }
  };

  // Filter tutors & courses according to grades
  const filteredTutors = selectedGrade === 'All' 
    ? MOCK_TUTORS 
    : MOCK_TUTORS.filter(t => t.grades.includes(selectedGrade));

  const filteredCourses = selectedGrade === 'All' 
    ? WELLNESS_COURSES 
    : WELLNESS_COURSES.filter(c => c.grades.includes(selectedGrade));

  const cartTotal = cart.reduce((acc, c) => acc + c.price, 0);

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'marketplace', label: 'Marketplace', icon: Compass },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="subapp-container">
      
      {/* 1. LEFT SIDEBAR NAVIGATION (Desktop Only - Hidden under 900px via media queries) */}
      <aside className="subapp-sidebar">
        <div className="subapp-sidebar-top">
          <div className="subapp-logo" onClick={() => { router.push('/'); }}>
            <img src="/logo_icon.png" alt="TeenHelpline Logo" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
            <div>
              <span className="subapp-logo-text">TeenHelpline</span>
              <span className="subapp-logo-sub">Student Portal</span>
            </div>
          </div>

          <nav className="subapp-nav">
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id as any); setCheckoutSuccess(false); }}
                  className={`subapp-nav-link ${activeTab === link.id ? 'active' : ''}`}
                >
                  <Icon size={18} /> {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="subapp-sidebar-bottom">
          {profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
              <img 
                src={`https://api.dicebear.com/10.x/big-smile/svg?seed=${avatarSeed || 'Alex'}`} 
                alt="User Avatar" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-cream)', border: '1px solid var(--border-soft)' }} 
              />
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-dark)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.display_name}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>{profile.points} points</span>
              </div>
            </div>
          )}
          <button onClick={handleSignOut} style={styles.exitBtn} className="btn">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER BAR (Visible under 900px) */}
      <nav className="dash-navbar dash-mobile-header" style={{ position: 'sticky', top: 0, zIndex: 100, display: 'none', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '65px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => { router.push('/'); setDashMobileOpen(false); }}>
            <img src="/logo_icon.png" alt="Logo" style={{ height: '28px', width: '28px' }} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>TeenHelpline</span>
          </div>
          <button onClick={() => setDashMobileOpen(!dashMobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
            {dashMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Dropdown Menu Drawer */}
        {dashMobileOpen && (
          <div style={{ position: 'absolute', top: '65px', left: 0, right: 0, backgroundColor: '#ffffff', boxShadow: 'var(--card-shadow)', padding: '1.2rem', borderBottom: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: '0.6rem', zIndex: 999 }}>
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id as any); setCheckoutSuccess(false); setDashMobileOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.7rem 1rem',
                    border: 'none',
                    backgroundColor: activeTab === link.id ? 'var(--primary-teal)' : 'transparent',
                    color: activeTab === link.id ? '#ffffff' : 'var(--text-muted)',
                    borderRadius: '12px',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={18} /> {link.label}
                </button>
              );
            })}
            {profile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', borderTop: '1px solid var(--border-soft)', marginTop: '0.5rem' }}>
                <img 
                  src={`https://api.dicebear.com/10.x/big-smile/svg?seed=${avatarSeed || 'Alex'}`} 
                  alt="Avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-cream)' }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{profile.display_name} ({profile.points} pts)</span>
              </div>
            )}
            <button onClick={handleSignOut} style={{ ...styles.exitBtn, width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}>
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* 2. RIGHT CONTENT WORKSPACE */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
        
        {/* Top Header Accessories bar */}
        <header className="dash-desktop-header" style={styles.topHeader}>
          {/* Search Input */}
          <div style={styles.searchBarWrapper}>
            <Search size={18} color="var(--text-light)" />
            <input 
              type="text" 
              placeholder="Search for courses, mentors, or skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBarInput}
            />
          </div>

          {/* Right side notification and checkout bag deck */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={styles.notificationWrapper} title="Notifications" onClick={() => alert('No new notifications!')}>
              <Bell size={20} color="var(--text-dark)" />
              <span style={styles.notificationBadge} />
            </div>
            
            <button 
              onClick={() => { setActiveTab('cart'); setCheckoutSuccess(false); }}
              style={styles.headerCartButton}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              <span style={styles.headerCartBadge}>{cart.length}</span>
            </button>
          </div>
        </header>

        {/* Content View Canvas */}
        <main className="dash-content-canvas" style={{ overflowY: 'auto', flexGrow: 1 }}>
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Welcome to Your Student Portal</h2>
                <p style={styles.sectionDesc}>Track your scheduled subject tuitions, wellness classes, and counseling sessions.</p>
              </div>

              {/* Scheduled Sessions (Purchased Classes) */}
              <div className="card" style={{ border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
                <div style={styles.iconHeadingRow}>
                  <Calendar size={22} color="var(--primary-teal)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>Your Scheduled Sessions ({bookings.length})</h3>
                </div>
                
                {bookings.length === 0 ? (
                  <div style={styles.emptySessions}>
                    <p>No active scheduled sessions. Go to the **Marketplace** tab to browse tutors and book classes.</p>
                  </div>
                ) : (
                  <div style={styles.sessionsGrid}>
                    {bookings.map((book) => {
                      const dateObj = new Date(book.appointment_time);
                      const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
                      const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={book.id} style={styles.sessionCard}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={book.counselor_photo} alt={book.counselor_name} style={styles.sessionAvatar} />
                            <div>
                              <strong style={{ fontSize: '1rem', color: 'var(--text-dark)', display: 'block' }}>{book.counselor_name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}>{book.counselor_expertise}</span>
                            </div>
                          </div>
                          <div style={styles.sessionMeta}>
                            <div style={styles.dateTimeBadge}>
                              <Clock size={12} />
                              <span>{formattedDate} at {formattedTime}</span>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Format: Live {book.session_type.toUpperCase()} room</span>
                            <button 
                              onClick={() => alert(`Connecting securely to anonymous virtual room with ${book.counselor_name}...`)}
                              className="btn btn-primary"
                              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', marginTop: '0.5rem', width: '100%' }}
                            >
                              Join Live Class
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === 'my-courses' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>My Wellness Courses</h2>
                <p style={styles.sectionDesc}>Read self-guided wellness courses compiled by child safety experts to build emotional strength.</p>
              </div>

              <div style={styles.coursesGrid}>
                {filteredCourses.map(course => (
                  <div key={course.id} className="card card-hover" style={styles.courseCard}>
                    <div style={styles.courseImageWrapper}>
                      <img src={course.image} alt={course.title} style={styles.courseCoverImg} />
                      <span style={styles.courseCategoryTag}>{course.category}</span>
                    </div>
                    
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flexGrow: 1 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>
                        {course.chapters} chapters • Offered by {course.counselor}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>{course.title}</h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{course.description}</p>
                      
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.4rem', marginBottom: '0.8rem' }}>
                        {course.grades.map(g => (
                          <span key={g} style={{ ...styles.gradeBadge, fontSize: '0.72rem' }}>{g}</span>
                        ))}
                      </div>

                      <button 
                        onClick={() => { setActiveCourse(course); setActiveChapterIndex(0); }} 
                        className="btn btn-secondary"
                        style={{ marginTop: 'auto', fontSize: '0.85rem', padding: '0.6rem' }}
                      >
                        Enroll & Start Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LEARNING MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div>
              {/* Marketplace Header */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.8px', marginBottom: '0.4rem' }}>Learning Marketplace</h1>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Expand your horizons with expert-led courses and professional counseling sessions designed for your career growth.</p>
              </div>

              {/* Filter Bar Card */}
              <div className="card" style={{ padding: '1.5rem 2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {/* Teacher/Counselor Toggle */}
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>I am looking for</span>
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-cream)', padding: '0.25rem', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                      <button
                        type="button"
                        onClick={() => setMarketType('teachers')}
                        style={{
                          border: 'none',
                          padding: '0.45rem 1.2rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          backgroundColor: marketType === 'teachers' ? '#20BEE8' : 'transparent',
                          color: marketType === 'teachers' ? '#323244' : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >
                        Teachers
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarketType('counselors')}
                        style={{
                          border: 'none',
                          padding: '0.45rem 1.2rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          backgroundColor: marketType === 'counselors' ? '#20BEE8' : 'transparent',
                          color: marketType === 'counselors' ? '#323244' : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >
                        Counselors
                      </button>
                    </div>
                  </div>

                  {/* Price Range dropdown */}
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Price Range</span>
                    <select 
                      value={marketPrice} 
                      onChange={(e) => setMarketPrice(e.target.value)}
                      style={{ width: '160px', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-soft)', backgroundColor: 'var(--bg-cream)', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      <option value="All">Any Price</option>
                      <option value="under_350">Under ₹350</option>
                      <option value="under_500">Under ₹500</option>
                    </select>
                  </div>

                  {/* Batch Start Date picker */}
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Batch Start Date</span>
                    <input 
                      type="date" 
                      value={marketDate} 
                      onChange={(e) => setMarketDate(e.target.value)}
                      style={{ width: '160px', padding: '0.45rem 1rem', borderRadius: '12px', border: '1px solid var(--border-soft)', backgroundColor: 'var(--bg-cream)', fontSize: '0.88rem', fontWeight: 600 }}
                    />
                  </div>
                </div>

                {/* Reset & Apply Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', alignSelf: 'flex-end' }}>
                  <button 
                    onClick={() => { alert('Filters applied successfully!'); }}
                    className="btn btn-primary"
                    style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <SlidersHorizontal size={16} /> Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setMarketPrice('All');
                      setMarketDate('');
                      setSelectedGrade('All');
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem 0.8rem', borderRadius: '12px', border: '1px solid var(--border-soft)', minWidth: 0 }}
                    title="Reset Filters"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Class Filter pill deck */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-light)' }}>Filter by Class:</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['All', 'Class 8th', 'Class 9th', 'Class 10th', 'Class 11th', 'Class 12th'].map(grade => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      style={{
                        backgroundColor: selectedGrade === grade ? '#20BEE8' : '#ffffff',
                        color: '#323244',
                        border: selectedGrade === grade ? '2px solid #20BEE8' : '1px solid var(--border-soft)',
                        padding: '0.35rem 0.9rem',
                        borderRadius: '50px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Cards */}
              {marketType === 'teachers' ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {MOCK_TUTORS.filter(t => {
                      const matchQuery = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         t.expertise.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchGrade = selectedGrade === 'All' ? true : t.grades.includes(selectedGrade);
                      const matchPrice = marketPrice === 'All' ? true : (
                        marketPrice === 'under_350' ? t.price <= 350 :
                        marketPrice === 'under_500' ? t.price <= 500 : true
                      );
                      return matchQuery && matchGrade && matchPrice;
                    }).map(tutor => (
                      <div key={tutor.id} className="card card-hover" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
                        <div style={{ height: '150px', backgroundColor: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--border-soft)', padding: '1rem' }}>
                          <img 
                            src="/media__1782218276491.png" 
                            alt="Teacher Illustration" 
                            style={{ height: '100%', objectFit: 'contain' }}
                          />
                          <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#20BEE8', color: '#323244', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>Teacher</span>
                        </div>
                        
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tutor.subject}</span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.2rem', marginBottom: '0.6rem' }}>{tutor.expertise}</h3>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                            <img src={tutor.photo} alt={tutor.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-soft)' }} />
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', display: 'block' }}>{tutor.name}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block' }}>{tutor.experience} experience</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                            <Star size={14} fill="#20BEE8" color="#20BEE8" />
                            <span>4.9</span>
                            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>(1.2k reviews)</span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                            {tutor.grades.map(g => (
                              <span key={g} style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'var(--bg-cream)', color: 'var(--text-dark)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>{g}</span>
                            ))}
                          </div>

                          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-soft)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>₹{tutor.price}</span>
                            <button 
                              onClick={() => handleBookTutorClick(tutor)}
                              style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#323244', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                              title="Book slot"
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {WELLNESS_COURSES.filter(c => {
                      const matchQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         c.counselor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchGrade = selectedGrade === 'All' ? true : c.grades.includes(selectedGrade);
                      return matchQuery && matchGrade;
                    }).map(course => (
                      <div key={course.id} className="card card-hover" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#ffffff' }}>
                        <div style={{ height: '150px', backgroundColor: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--border-soft)', padding: '1rem' }}>
                          <img 
                            src={course.image} 
                            alt="Course Illustration" 
                            style={{ height: '100%', objectFit: 'contain' }}
                          />
                          <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#FFC0C1', color: '#323244', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>Counselor</span>
                        </div>
                        
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{course.category}</span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.2rem', marginBottom: '0.6rem' }}>{course.title}</h3>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                            <img src="https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200" alt={course.counselor} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-soft)' }} />
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', display: 'block' }}>{course.counselor}</span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block' }}>Expert stream advisor</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                            <Star size={14} fill="#20BEE8" color="#20BEE8" />
                            <span>5.0</span>
                            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>(480 reviews)</span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                            {course.grades.map(g => (
                              <span key={g} style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'var(--bg-cream)', color: 'var(--text-dark)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>{g}</span>
                            ))}
                          </div>

                          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-soft)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>₹199</span>
                            <button 
                              onClick={() => {
                                const cartId = Math.random().toString(36).substring(2, 9);
                                addToCart({
                                  cartId,
                                  id: course.id,
                                  name: `${course.title} - Course`,
                                  price: 199,
                                  type: 'tuition',
                                  photo: course.image,
                                  details: `Enrollment into self-guided wellness lessons`,
                                  bookingDetails: null
                                });
                              }}
                              style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#323244', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                              title="Add to Cart"
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Courses dropdown/button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <button 
                  onClick={() => alert('All marketplace courses and tutors are displayed.')}
                  className="btn btn-secondary" 
                  style={{ padding: '0.65rem 1.8rem', fontSize: '0.88rem', border: '1px solid var(--border-soft)' }}
                >
                  Load More Courses
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MENTORS */}
          {activeTab === 'mentors' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Meet Our Academic & Personal Mentors</h2>
                <p style={styles.sectionDesc}>Book specialized live tuitions or direct 1-on-1 counseling slots with verified school advisors.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {MOCK_TUTORS.map(tutor => (
                  <div key={tutor.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', borderBottom: '1px solid var(--border-soft)', paddingBottom: '1rem' }}>
                      <img src={tutor.photo} alt={tutor.name} style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #20BEE8' }} />
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)', display: 'block' }}>{tutor.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#20BEE8', fontWeight: 700, backgroundColor: 'var(--bg-cream)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-soft)', display: 'inline-block', marginTop: '0.2rem' }}>{tutor.subject}</span>
                      </div>
                    </div>
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Experience:</span>
                        <strong>{tutor.experience}</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Format:</span>
                        <strong>{tutor.mode}</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Target Classes:</span>
                        <strong>{tutor.grades.join(', ')}</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Session Price:</span>
                        <strong style={{ color: '#20BEE8' }}>₹{tutor.price}</strong>
                      </li>
                    </ul>

                    <button 
                      onClick={() => handleBookTutorClick(tutor)}
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem', marginTop: '0.5rem' }}
                    >
                      Book Guidance Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CART */}
          {activeTab === 'cart' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Shopping Cart Portal</h2>
                <p style={styles.sectionDesc}>Review your selected tuition classes, career guidance workshops, or pricing packages before activating.</p>
              </div>

              {checkoutSuccess ? (
                <div style={{ ...styles.successStateBox, backgroundColor: '#FAF9F6', border: '1px solid var(--border-color)' }}>
                  <div style={{ ...styles.successGlowTick, backgroundColor: '#20BEE8', color: '#323244' }}>✓</div>
                  <h2 style={{ color: 'var(--text-dark)', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>Subscription Activated!</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '500px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
                    Congratulations! Your subject tuitions and counseling classes have been successfully booked and added to your "Scheduled Sessions" list. You have also been awarded +25 safety points.
                  </p>
                  <button 
                    onClick={() => { setCheckoutSuccess(false); setActiveTab('dashboard'); }}
                    className="btn btn-primary"
                  >
                    View Scheduled Sessions
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div style={styles.emptyCartBox}>
                  <ShoppingCart size={48} color="var(--text-light)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '1rem' }}>Your Cart is Empty</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', maxWidth: '350px', margin: '0.5rem auto 1.5rem auto' }}>
                    Add CBSE/ICSE grades tuitions or counseling credits to your checkout queue.
                  </p>
                  <button onClick={() => setActiveTab('marketplace')} className="btn btn-primary">
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="cart-items-column-layout">
                  {/* Cart Items List */}
                  <div className="cart-items-container-list">
                    {cart.map((item) => (
                      <div key={item.cartId} className="cart-item-card-row">
                        <div className="cart-item-info-side">
                          {item.photo ? (
                            <img src={item.photo} alt={item.name} className="cart-item-avatar-img" />
                          ) : (
                            <div style={styles.planAvatarPlaceholder}>💎</div>
                          )}
                          <div className="cart-item-title-desc">
                            <strong style={{ fontSize: '1.02rem', color: 'var(--text-dark)' }}>{item.name}</strong>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item.details}</span>
                          </div>
                        </div>

                        <div className="cart-item-price-remove">
                          <span className="cart-item-price-tag">₹{item.price.toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.cartId)} className="cart-item-remove-btn" title="Remove">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary Card */}
                  <div className="cart-summary-card">
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.2rem' }}>Summary Details</h3>
                    
                    <div className="cart-summary-line">
                      <span>Items Count:</span>
                      <strong>{cart.length}</strong>
                    </div>
                    <div className="cart-summary-line">
                      <span>Subtotal:</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="cart-summary-line">
                      <span>Discount:</span>
                      <span style={{ color: 'var(--primary-teal)' }}>- ₹0</span>
                    </div>

                    <div className="cart-summary-total-line">
                      <span>Total Amount:</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>

                    <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                      Confirm & Subscribe
                    </button>

                    <div style={styles.cartGuarantees}>
                      <span>🔒 SECURE CHECKOUT</span>
                      <span>•</span>
                      <span>CANCEL ANYTIME</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Account Settings & Preferences</h2>
                <p style={styles.sectionDesc}>Customize your profile details, choose a custom avatar seed, or subscribe to credits packages.</p>
              </div>

              <div className="split-grid-two-col">
                {/* Left Column: Avatar Customizer */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.8rem' }}>DiceBear Avatar Generator</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Choose your profile avatar using the DiceBear Big-Smile library. Type a nickname or seed below to generate your unique custom design!</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-cream)', padding: '1.5rem', borderRadius: '18px', border: '1px solid var(--border-soft)' }}>
                    <img 
                      src={`https://api.dicebear.com/10.x/big-smile/svg?seed=${avatarSeed || 'Alex'}`} 
                      alt="DiceBear Live Preview" 
                      style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#ffffff', padding: '0.5rem', border: '2px solid #20BEE8', boxShadow: 'var(--card-shadow)' }} 
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)' }}>Live Preview</span>
                  </div>

                  <div style={styles.formLayout}>
                    <div>
                      <label style={styles.formInputLabel}>Custom Seed / Nickname</label>
                      <input 
                        type="text" 
                        value={avatarSeed}
                        onChange={(e) => {
                          setAvatarSeed(e.target.value);
                          localStorage.setItem('th_avatar_seed', e.target.value);
                        }}
                        placeholder="Type anything (e.g. Jordan, Sunny, Sky)..."
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px' }}
                      />
                    </div>
                    
                    <div className="settings-button-deck">
                      <button 
                        onClick={() => {
                          const newSeed = 'Smile' + Math.floor(Math.random() * 10000);
                          setAvatarSeed(newSeed);
                          localStorage.setItem('th_avatar_seed', newSeed);
                        }}
                        className="btn btn-secondary"
                        style={{ flexGrow: 1, padding: '0.65rem', borderRadius: '12px', fontSize: '0.88rem' }}
                      >
                        🎲 Shuffle Avatar
                      </button>
                      <button 
                        onClick={() => {
                          alert('Avatar setting saved successfully!');
                        }}
                        className="btn btn-primary"
                        style={{ flexGrow: 1, padding: '0.65rem', borderRadius: '12px', fontSize: '0.88rem' }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing Packages */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.8rem' }}>Subscription Plans</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Choose class credits packages to book tutors and career specialists.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {SUBSCRIPTION_PLANS.map(plan => (
                      <div key={plan.id} style={{ padding: '1.2rem', borderRadius: '18px', border: plan.popular ? '2px solid #20BEE8' : '1px solid var(--border-soft)', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.98rem' }}>{plan.name}</span>
                          <span style={{ fontWeight: 800, color: '#20BEE8', fontSize: '1.1rem' }}>₹{plan.price}</span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Includes: {plan.features[0]} & {plan.features[1]}</span>
                        <button
                          onClick={() => {
                            const cartId = Math.random().toString(36).substring(2, 9);
                            addToCart({
                              cartId,
                              id: plan.id,
                              name: plan.name,
                              price: plan.price,
                              type: 'plan',
                              photo: '',
                              details: `Subscription Package for 1 month`
                            });
                          }}
                          className="btn btn-primary"
                          style={{ padding: '0.5rem', fontSize: '0.82rem', borderRadius: '8px', width: '100%', marginTop: '0.4rem' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. BOOKING SLOT FORM MODAL */}
      {selectedTutor && (
        <div style={styles.modalOverlay} onClick={() => setSelectedTutor(null)}>
          <div style={styles.modalCard} className="card animate-pop" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Select Format & Schedule</h3>
              <button onClick={() => setSelectedTutor(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBookingToCart} style={styles.modalFormLayout}>
              <div style={styles.tutorBriefCard}>
                <img src={selectedTutor.photo} alt={selectedTutor.name} style={styles.briefAvatarImg} />
                <div>
                  <h4 style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.98rem' }}>{selectedTutor.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{selectedTutor.expertise}</span>
                </div>
              </div>

              <div style={styles.formRowInput}>
                <label style={styles.formInputLabel}>Session Format</label>
                <div style={styles.tripleToggleRow}>
                  <button 
                    type="button" 
                    onClick={() => setBookingType('video')} 
                    style={{...styles.toggleBtn, ...(bookingType === 'video' ? styles.toggleBtnActive : {})}}
                  >
                    🎥 Video Class
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBookingType('audio')} 
                    style={{...styles.toggleBtn, ...(bookingType === 'audio' ? styles.toggleBtnActive : {})}}
                  >
                    📞 Voice Audio
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBookingType('text')} 
                    style={{...styles.toggleBtn, ...(bookingType === 'text' ? styles.toggleBtnActive : {})}}
                  >
                    💬 Text Support
                  </button>
                </div>
              </div>

              <div style={styles.dateTimeGridInputs}>
                <div style={{ flexGrow: 1 }}>
                  <label style={styles.formInputLabel}>Select Date</label>
                  <input 
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div style={{ width: '130px' }}>
                  <label style={styles.formInputLabel}>Select Time</label>
                  <input 
                    type="time" 
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Add Class to Cart (₹{selectedTutor.price})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. WELLNESS COURSE READER MODAL */}
      {activeCourse && (
        <div style={styles.modalOverlay} onClick={() => setActiveCourse(null)}>
          <div style={{...styles.modalCard, maxWidth: '650px'}} className="card animate-pop" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <span className="tag tag-calm" style={{ marginBottom: '0.4rem' }}>{activeCourse.category}</span>
                <h3 style={styles.modalTitle}>{activeCourse.title}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Instructor: {activeCourse.counselor}</span>
              </div>
              <button onClick={() => setActiveCourse(null)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {courseCompletedMsg ? (
              <div style={{ ...styles.successStateBox, backgroundColor: '#FAF9F6', border: '1px solid var(--border-color)' }}>
                <div style={{ ...styles.successGlowTick, backgroundColor: '#20BEE8', color: '#323244' }}>🎉</div>
                <h4 style={{ color: 'var(--text-dark)', fontWeight: 800, marginBottom: '0.5rem' }}>Lessons Completed!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{courseCompletedMsg}</p>
              </div>
            ) : (
              <div style={styles.courseReadingCanvas}>
                {/* Chapter tracker bar */}
                <div style={styles.chapterTrackProgressBar}>
                  {activeCourse.syllabus.map((_: any, idx: number) => (
                    <div 
                      key={idx} 
                      style={{
                        ...styles.progressBarStep,
                        backgroundColor: idx <= activeChapterIndex ? 'var(--primary-teal)' : 'var(--border-color)'
                      }} 
                    />
                  ))}
                </div>

                <div style={styles.chapterCardContent}>
                  <span style={styles.chapterNumberBadge}>Chapter {activeChapterIndex + 1} of {activeCourse.syllabus.length}</span>
                  <h4 style={styles.chapterTitleText}>{activeCourse.syllabus[activeChapterIndex].title}</h4>
                  <p style={styles.chapterMainParagraphText}>
                    {activeCourse.syllabus[activeChapterIndex].content}
                  </p>
                </div>

                <div style={styles.chapterNavigationFooter}>
                  <button 
                    onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))} 
                    disabled={activeChapterIndex === 0} 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={handleFinishChapter} 
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
                  >
                    {activeChapterIndex === activeCourse.syllabus.length - 1 ? 'Finish Course (+20 pts)' : 'Next Chapter →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// Custom Premium inline styles that complement global CSS variables
const styles: Record<string, React.CSSProperties> = {
  topHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 3rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--border-soft)',
    height: '75px',
    position: 'sticky',
    top: 0,
    zIndex: 90
  },
  searchBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: 'var(--bg-cream)',
    padding: '0.5rem 1.2rem',
    borderRadius: '12px',
    width: '380px',
    border: '1px solid var(--border-soft)'
  },
  searchBarInput: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: 0,
    fontSize: '0.92rem',
    width: '100%',
    outline: 'none',
    boxShadow: 'none'
  },
  notificationWrapper: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-cream)',
    transition: 'all 0.2s'
  },
  notificationBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    backgroundColor: '#FFC0C1',
    borderRadius: '50%',
    border: '1.5px solid #ffffff'
  },
  headerCartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#323244',
    color: '#ffffff',
    padding: '0.5rem 1.2rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.92rem',
    fontWeight: 600,
    fontFamily: 'Outfit, sans-serif'
  },
  headerCartBadge: {
    backgroundColor: '#20BEE8',
    color: '#323244',
    fontSize: '0.75rem',
    fontWeight: 800,
    borderRadius: '4px',
    padding: '0.1rem 0.4rem',
    marginLeft: '0.2rem'
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-soft-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(82, 121, 111, 0.15)'
  },
  userProfilePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: '#ffffff',
    padding: '0.5rem 1.2rem',
    borderRadius: '50px',
    fontSize: '0.88rem',
    border: '1px solid var(--border-soft)',
    boxShadow: 'var(--card-shadow)'
  },
  verticalDivider: {
    color: 'var(--border-color)',
    fontWeight: 300
  },
  exitBtn: {
    backgroundColor: '#323244',
    color: '#ffffff',
    padding: '0.5rem 1.2rem',
    borderRadius: '50px',
    fontSize: '0.88rem',
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(197, 48, 48, 0.15)',
    transition: 'all 0.2s'
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: '#ffffff',
    padding: '0.8rem 1.5rem',
    borderRadius: '18px',
    marginBottom: '2.5rem',
    border: '1px solid var(--border-soft)',
    flexWrap: 'wrap'
  },
  filterPills: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  filterPill: {
    backgroundColor: 'var(--bg-cream)',
    border: '1px solid var(--border-soft)',
    padding: '0.4rem 1rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.25s ease'
  },
  filterPillActive: {
    backgroundColor: 'var(--primary-teal)',
    color: '#ffffff',
    borderColor: 'var(--primary-teal)',
    boxShadow: 'var(--btn-shadow)'
  },
  sectionHeader: {
    marginBottom: '2.5rem',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--text-dark)',
    letterSpacing: '-0.5px'
  },
  sectionDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    marginTop: '0.3rem'
  },
  emptySessions: {
    padding: '2.5rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.92rem',
    backgroundColor: 'var(--bg-cream)',
    borderRadius: '16px',
    border: '1.5px dashed var(--border-soft)'
  },
  sessionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem'
  },
  sessionCard: {
    backgroundColor: 'var(--bg-cream)',
    borderRadius: '18px',
    padding: '1.2rem',
    border: '1px solid var(--border-soft)',
    boxShadow: 'var(--card-shadow)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  sessionAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--primary-teal)'
  },
  sessionMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    borderTop: '1px solid rgba(82, 121, 111, 0.1)',
    paddingTop: '0.8rem'
  },
  dateTimeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: '#FFC0C1',
    color: '#B7791F',
    padding: '0.25rem 0.6rem',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 700,
    width: 'fit-content'
  },
  gradeBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: 'var(--bg-soft-teal)',
    color: 'var(--primary-teal)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem'
  },
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  courseCoverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  courseImageWrapper: {
    position: 'relative',
    height: '160px',
    backgroundColor: 'var(--bg-sand)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem'
  },
  courseCategoryTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'var(--accent-clay)',
    color: '#ffffff',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  splitGridTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  iconHeadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  formInputLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-dark)',
    marginBottom: '0.4rem',
    display: 'block'
  },
  reflectionSection: {
    marginTop: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1.5rem'
  },
  historyTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    color: 'var(--text-dark)',
    marginBottom: '1rem'
  },
  journalScroller: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '0.5rem'
  },
  journalItem: {
    backgroundColor: 'var(--bg-cream)',
    borderRadius: '16px',
    padding: '1rem',
    border: '1px solid var(--border-soft)'
  },
  reflectionBox: {
    marginTop: '0.8rem',
    backgroundColor: 'var(--bg-soft-teal)',
    borderLeft: '3px solid var(--primary-teal)',
    padding: '0.6rem 0.8rem',
    borderRadius: '4px 12px 12px 4px'
  },
  habitRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.5rem 0'
  },
  habitCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--primary-teal)'
  },
  addHabitForm: {
    display: 'flex',
    gap: '0.6rem',
    marginTop: '0.5rem'
  },
  pointsMultiplierNotice: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'center',
    backgroundColor: 'var(--bg-sand)',
    padding: '0.8rem 1rem',
    borderRadius: '14px',
    marginTop: '1rem'
  },
  emptyCartBox: {
    padding: '5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    border: '1px solid var(--border-soft)',
    boxShadow: 'var(--card-shadow)'
  },
  planAvatarPlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-clay-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem'
  },
  cartGuarantees: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: 'var(--text-light)',
    fontSize: '0.72rem',
    fontWeight: 700,
    marginTop: '1.2rem',
    letterSpacing: '0.5px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(92, 107, 115, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    maxWidth: '500px',
    width: '100%',
    padding: '2.2rem',
    borderRadius: '28px',
    border: '1px solid var(--border-soft)',
    boxShadow: '0 20px 45px rgba(50, 50, 68, 0.08)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.2rem'
  },
  modalTitle: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--text-dark)',
    letterSpacing: '-0.3px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-cream)'
  },
  modalFormLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  tutorBriefCard: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
    backgroundColor: 'var(--bg-cream)',
    padding: '0.8rem',
    borderRadius: '16px',
    border: '1px solid var(--border-soft)'
  },
  briefAvatarImg: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--primary-teal)'
  },
  tripleToggleRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.4rem',
    backgroundColor: 'var(--bg-cream)',
    padding: '0.25rem',
    borderRadius: '14px'
  },
  toggleBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '0.5rem 0.2rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    color: 'var(--primary-teal)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  dateTimeGridInputs: {
    display: 'flex',
    gap: '1rem'
  },
  successStateBox: {
    padding: '2rem 1rem',
    textAlign: 'center',
    backgroundColor: '#F0FFF4',
    border: '1px solid #FAF9F6',
    borderRadius: '20px'
  },
  successGlowTick: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: 'var(--success-green)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.6rem',
    margin: '0 auto 1rem auto',
    fontWeight: 'bold'
  },
  courseReadingCanvas: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  chapterTrackProgressBar: {
    display: 'flex',
    gap: '0.4rem',
    width: '100%',
    height: '4px'
  },
  progressBarStep: {
    flexGrow: 1,
    height: '100%',
    borderRadius: '2px'
  },
  chapterCardContent: {
    backgroundColor: 'var(--bg-cream)',
    borderRadius: '20px',
    padding: '1.8rem',
    border: '1px solid var(--border-soft)'
  },
  chapterNumberBadge: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--primary-teal-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  chapterTitleText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-dark)',
    marginTop: '0.4rem',
    marginBottom: '0.8rem'
  },
  chapterMainParagraphText: {
    fontSize: '0.96rem',
    lineHeight: 1.6,
    color: 'var(--text-muted)'
  },
  chapterNavigationFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};
