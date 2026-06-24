'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Compass, MessageCircle, BookOpen, Users, User, Settings, Info,
  Bell, HelpCircle, Play, Headset, FileText, ArrowRight, ShieldCheck, Send, CheckCircle2, Smile, X
} from 'lucide-react';
import { dbService } from '../../lib/supabase';

interface ChatMessage {
  id: string;
  sender: string;
  time: string;
  content: string;
  isMe: boolean;
}

export default function Community() {
  const router = useRouter();
  
  // Interactive States
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(124);
  const [rsvpStatus, setRsvpStatus] = useState<'rsvp' | 'going'>('rsvp');
  
  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Anonymous',
      time: '2m ago',
      content: "I've been feeling really overwhelmed with work lately. Anyone have tips for disconnecting in the evenings?",
      isMe: false
    },
    {
      id: 'm2',
      sender: 'Member23',
      time: '1m ago',
      content: "I usually try to take a 15 minute walk right after I log off. It helps create a physical boundary.",
      isMe: false
    }
  ]);
  const [typedMessage, setTypedMessage] = useState('');
  const [alertText, setAlertText] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    dbService.initialize();
  }, []);

  // Actions
  const handleJoinToggle = () => {
    if (joined) {
      setJoined(false);
      setMemberCount(prev => prev - 1);
    } else {
      setJoined(true);
      setMemberCount(prev => prev + 1);
      // Award Points
      dbService.addPoints(5, 'user123');
      window.dispatchEvent(new Event('profileUpdated'));
    }
  };

  const handleRSVPToggle = () => {
    if (rsvpStatus === 'rsvp') {
      setRsvpStatus('going');
      // Award Points
      dbService.addPoints(5, 'user123');
      window.dispatchEvent(new Event('profileUpdated'));
    } else {
      setRsvpStatus('rsvp');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const userText = typedMessage.trim();
    const cleanText = userText.toLowerCase();

    // Safety checks
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(userText) || cleanText.includes('phone') || cleanText.includes('number') || cleanText.includes('instagram') || cleanText.includes('snapchat')) {
      setAlertText("❌ Sharing personal contact details is prohibited for your safety.");
      setTimeout(() => setAlertText(''), 3000);
      return;
    }

    const abusiveKeywords = ['loser', 'stupid', 'idiot', 'ugly', 'die'];
    if (abusiveKeywords.some(kw => cleanText.includes(kw))) {
      setAlertText("❌ Message blocked by AI safety filters.");
      setTimeout(() => setAlertText(''), 3000);
      return;
    }

    // Add user message
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'You (Anonymous)',
      time: 'Just now',
      content: userText,
      isMe: true
    };

    setChatMessages(prev => [...prev, newMsg]);
    setTypedMessage('');

    // Buddy automated reply
    setTimeout(() => {
      let buddyResponse = "That sounds really tough. I'm right here if you need to talk one-on-one, dost. Take it easy.";
      
      if (cleanText.includes('walk') || cleanText.includes('exercise') || cleanText.includes('sleep')) {
        buddyResponse = "That is a wonderful coping mechanism! Rest and physical movement tell our body we are safe. 🌸";
      } else if (cleanText.includes('exam') || cleanText.includes('study') || cleanText.includes('stress')) {
        buddyResponse = "Exam pressure can feel heavy. Remember to take a 5-minute Pomodoro break and breathe in the Calm Zone. 🎒";
      } else if (cleanText.includes('lonely') || cleanText.includes('sad')) {
        buddyResponse = "You are not alone, friend. We are all here supporting each other. I'm listening. ❤️";
      }

      const buddyMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'Buddy (AI Moderator)',
        time: 'Just now',
        content: buddyResponse,
        isMe: false
      };
      setChatMessages(prev => [...prev, buddyMsg]);
    }, 1500);
  };

  return (
    <div className="subapp-container">
      
      {/* LEFT SIDEBAR (Screenshot Replica) */}
      <aside className="subapp-sidebar">
        <div className="subapp-sidebar-top">
          <div className="subapp-logo" onClick={() => router.push('/')}>
            <div style={styles.logoIcon}>
              <Heart size={20} fill="#20BEE8" color="#20BEE8" />
            </div>
            <div>
              <span className="subapp-logo-text">SafeLine</span>
              <span className="subapp-logo-sub">Community Support</span>
            </div>
          </div>

          <button onClick={() => setShowHelpModal(true)} className="btn btn-primary" style={styles.sidebarHelpBtn}>
            Get Help Now
          </button>

          <nav className="subapp-nav">
            <Link href="/" className="subapp-nav-link">
              <Compass size={18} />
              <span>Home</span>
            </Link>
            <Link href="/resources" className="subapp-nav-link">
              <BookOpen size={18} />
              <span>Resources</span>
            </Link>
            <Link href="/community" className="subapp-nav-link active">
              <Users size={18} />
              <span>Support Groups</span>
            </Link>
            <a href={process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'} target="_blank" rel="noopener noreferrer" className="subapp-nav-link">
              <User size={18} />
              <span>My Profile</span>
            </a>
          </nav>
        </div>

        <div className="subapp-sidebar-bottom">
          <a href={process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'} target="_blank" rel="noopener noreferrer" className="subapp-nav-link">
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <div className="subapp-nav-link" onClick={() => router.push('/')}>
            <Info size={18} />
            <span>About SafeLine</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT CANVAS */}
      <main className="subapp-content-canvas" style={{ backgroundColor: '#FAF9F6' }}>
        
        {/* Sub-Website Top Bar Header */}
        <header style={styles.contentHeader}>
          <h2 style={styles.contentHeaderTitle}>Stress Management Group</h2>
          <div style={styles.headerRightWidgets}>
            <button style={styles.headerIconBtn} aria-label="Notifications">
              <Bell size={18} color="#323244" />
            </button>
            <button style={styles.headerIconBtn} aria-label="Chat">
              <MessageCircle size={18} color="#323244" />
            </button>
            <button onClick={() => window.open(process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001', '_blank')} className="btn btn-secondary" style={styles.supportBadge}>
              Support
            </button>
            <div style={styles.avatarImgMock}>
              <Smile size={18} color="#20BEE8" />
            </div>
          </div>
        </header>

        {/* HERO BANNER CARD */}
        <div className="comm-banner-card">
          <div className="comm-banner-left" style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="tag tag-calm" style={{ backgroundColor: '#ffffff', color: '#20BEE8' }}>Wellbeing</span>
              <span className="tag tag-stressed" style={{ backgroundColor: '#ffffff', color: '#B7791F' }}>Peer Support</span>
            </div>
            <h1 className="comm-banner-title">Stress Management Group</h1>
            <p className="comm-banner-desc">
              A safe space to share and learn from others going through similar challenges.
            </p>
          </div>

          <img 
            src="/media__1782225726481.png" 
            alt="Peer Stress Support" 
            style={styles.commBannerIllustration} 
          />
          
          <div className="comm-banner-right">
            <div className="member-pill-group">
              <div style={styles.avatarPillsStacked}>
                <div style={{...styles.pillAvatar, backgroundColor: '#FFC0C1'}}>👤</div>
                <div style={{...styles.pillAvatar, backgroundColor: '#FFC0C1', marginLeft: '-8px'}}>👤</div>
                <div style={{...styles.pillAvatar, backgroundColor: '#A0AEC0', marginLeft: '-8px'}}>👤</div>
              </div>
              <span style={{ marginLeft: '6px' }}>+{memberCount - 3}</span>
            </div>
            <button 
              onClick={handleJoinToggle} 
              className="btn btn-primary"
              style={{
                backgroundColor: joined ? 'var(--accent-sage)' : 'var(--primary-teal)',
                border: 'none',
                fontSize: '0.9rem',
                padding: '0.6rem 1.4rem'
              }}
            >
              {joined ? 'Joined ✓' : 'Join Group'}
            </button>
          </div>
        </div>

        {/* TWO COLUMN GRID */}
        <div className="comm-main-grid">
          
          {/* LEFT COLUMN: WEEKLY CHECK-IN & CHAT */}
          <div>
            
            {/* Weekly Check-in Section */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.8rem' }}>
              <div style={styles.sectionHeaderLine}>
                <Compass size={18} color="#20BEE8" />
                <h3 style={styles.sectionTitle}>Weekly Check-in</h3>
              </div>

              <div style={styles.workshopCard}>
                <div style={styles.workshopHeader}>
                  <h4 style={styles.workshopTitle}>Mindfulness Techniques Workshop</h4>
                  <span style={styles.startsInBadge}>Starts in 2h</span>
                </div>
                <p style={styles.workshopText}>
                  Join us for a guided session on practical mindfulness exercises to manage daily stress. All members welcome.
                </p>
                <div style={styles.workshopFooter}>
                  <span style={styles.facilitatorName}>👤 Posted by Facilitator Sarah</span>
                  <button 
                    onClick={handleRSVPToggle} 
                    className="btn btn-text"
                    style={{
                      color: rsvpStatus === 'going' ? 'var(--success-green)' : 'var(--primary-teal)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none'
                    }}
                  >
                    {rsvpStatus === 'going' ? 'Going ✓' : 'RSVP'}
                  </button>
                </div>
              </div>
            </div>

            {/* Group Support Chat Section */}
            <div className="chat-container-card">
              <div className="chat-header-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageCircle size={18} color="#20BEE8" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#323244' }}>Group Support Chat</h3>
                </div>
                <span style={styles.moderatedBadge}>
                  <ShieldCheck size={12} color="#20BEE8" /> Moderated
                </span>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages-area">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="chat-msg-bubble" style={{ alignSelf: msg.isMe ? 'flex-end' : 'flex-start', flexDirection: msg.isMe ? 'row-reverse' : 'row' }}>
                    <div className="chat-msg-avatar" style={{ backgroundColor: msg.isMe ? 'var(--bg-soft-teal)' : '#EBEFEA' }}>
                      {msg.sender.includes('Buddy') ? '🤖' : '👤'}
                    </div>
                    <div className="chat-msg-content" style={{ backgroundColor: msg.isMe ? 'var(--bg-soft-teal)' : '#ffffff' }}>
                      <div className="chat-msg-meta">
                        <span style={{ color: msg.isMe ? 'var(--primary-teal)' : '#323244' }}>{msg.sender}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="chat-msg-text">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert Message for safety filters */}
              {alertText && (
                <div style={styles.chatAlert}>
                  {alertText}
                </div>
              )}

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input 
                  type="text"
                  className="chat-text-input"
                  placeholder="Type a supportive message..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  maxLength={180}
                  required
                />
                <button type="submit" className="chat-send-btn" aria-label="Send">
                  <Send size={16} color="#ffffff" />
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: SHARED RESOURCES & GROUP INFO */}
          <div>
            
            {/* Shared Resources Panel */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.8rem' }}>
              <div style={styles.sidebarPanelHeader}>
                <h3 style={styles.sidebarPanelTitle}>Shared Resources</h3>
                <Link href="/resources" style={styles.viewAllLink}>View All</Link>
              </div>

              <div className="resource-grid-2x2">
                <div className="res-grid-card" onClick={() => router.push('/calm-zone')}>
                  <div className="res-grid-icon-circle">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <span>Breathing Exercises</span>
                </div>
                <div className="res-grid-card" onClick={() => router.push('/calm-zone')}>
                  <div className="res-grid-icon-circle">
                    <Headset size={16} />
                  </div>
                  <span>Meditation Tracks</span>
                </div>
                <div className="res-grid-card" onClick={() => router.push('/resources')}>
                  <div className="res-grid-icon-circle">
                    <FileText size={16} />
                  </div>
                  <span>Stress Guide</span>
                </div>
                <div className="res-grid-card" onClick={() => router.push('/resources')}>
                  <div className="res-grid-icon-circle">
                    <ArrowRight size={16} />
                  </div>
                  <span>More Resources</span>
                </div>
              </div>
            </div>

            {/* Group Info Panel */}
            <div className="card" style={{ padding: '1.8rem' }}>
              <h3 style={{ ...styles.sidebarPanelTitle, marginBottom: '1rem' }}>Group Info</h3>
              
              <div style={styles.infoTagsContainer}>
                <span style={styles.infoTag}>#StressRelief</span>
                <span style={styles.infoTag}>#Anxiety</span>
                <span style={styles.infoTag}>#WorkLife</span>
                <span style={styles.infoTag}>#Mindfulness</span>
              </div>

              <div style={styles.groupInfoStatsList}>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Next Meeting</span>
                  <strong style={styles.statValue}>Today, 6:00 PM</strong>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Members Active</span>
                  <strong style={styles.statValue} className="animate-pop">{memberCount}</strong>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Group Type</span>
                  <strong style={styles.statValue}>Open, Moderated</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Emergency Distress/Help Modal */}
      {showHelpModal && (
        <div style={styles.modalOverlay} onClick={() => setShowHelpModal(false)}>
          <div style={styles.modalCard} className="card animate-pop" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ ...styles.modalTitle, color: '#323244' }}>Emergency & Crisis Helplines</h2>
              <button onClick={() => setShowHelpModal(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#323244', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              If you or a friend is going through a tough time, feeling suicidal, or in any distress, please reach out immediately. Help is always available.
            </p>
            <div style={styles.crisisList}>
              <div style={styles.crisisItem}>
                <strong>AASRA Helpline (Suicide & Crisis)</strong>
                <a href="tel:+919820466726" style={styles.phoneLink}>📞 +91-9820466726 (24/7)</a>
              </div>
              <div style={styles.crisisItem}>
                <strong>Vandrevala Foundation (Mental Health)</strong>
                <a href="tel:+919999666555" style={styles.phoneLink}>📞 +91-9999666555 (24/7)</a>
              </div>
              <div style={styles.crisisItem}>
                <strong>Kiran Helpline (Govt of India)</strong>
                <a href="tel:18005990019" style={styles.phoneLink}>📞 1800-599-0019 (24/7)</a>
              </div>
              <div style={styles.crisisItem}>
                <strong>Childline (Govt of India)</strong>
                <a href="tel:1098" style={styles.phoneLink}>📞 1098 (24/7)</a>
              </div>
            </div>
            <button onClick={() => { setShowHelpModal(false); window.dispatchEvent(new Event('openBuddyChat')); }} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              Speak with Buddy AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styles
const styles: Record<string, React.CSSProperties> = {
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    backgroundColor: '#FAF9F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(32, 190, 232, 0.15)'
  },
  sidebarHelpBtn: {
    backgroundColor: '#323244',
    color: '#ffffff',
    fontSize: '0.9rem',
    padding: '0.65rem 1.2rem',
    borderRadius: '50px',
    border: 'none',
    boxShadow: '0 4px 10px rgba(197, 48, 48, 0.25)',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    borderBottom: '1px solid rgba(32, 190, 232, 0.15)',
    paddingBottom: '1rem'
  },
  contentHeaderTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#323244',
    letterSpacing: '-0.5px'
  },
  headerRightWidgets: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  headerIconBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(50, 50, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  supportBadge: {
    padding: '0.45rem 1rem',
    fontSize: '0.82rem',
    fontWeight: 700
  },
  avatarImgMock: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#FAF9F6',
    border: '1px solid var(--primary-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarPillsStacked: {
    display: 'flex',
    alignItems: 'center'
  },
  pillAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    color: '#ffffff',
    border: '1.5px solid #FAF9F6',
    fontWeight: 'bold'
  },
  sectionHeaderLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#323244'
  },
  workshopCard: {
    backgroundColor: '#FAF9F6',
    borderRadius: '16px',
    padding: '1.2rem 1.5rem',
    border: '1px solid var(--border-soft)'
  },
  workshopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  workshopTitle: {
    fontSize: '0.98rem',
    fontWeight: 700,
    color: '#323244'
  },
  startsInBadge: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#B7791F',
    backgroundColor: '#FFC0C1',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px'
  },
  workshopText: {
    fontSize: '0.88rem',
    color: '#323244',
    lineHeight: 1.4,
    marginBottom: '1rem'
  },
  workshopFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(143,158,139,0.08)',
    paddingTop: '0.8rem'
  },
  facilitatorName: {
    fontSize: '0.8rem',
    color: '#20BEE8',
    fontWeight: 600
  },
  moderatedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--primary-teal)',
    backgroundColor: 'var(--bg-soft-teal)',
    padding: '0.25rem 0.6rem',
    borderRadius: '50px'
  },
  chatAlert: {
    padding: '0.5rem 1rem',
    backgroundColor: '#FFC0C1',
    color: '#323244',
    fontSize: '0.8rem',
    fontWeight: 600,
    textAlign: 'center',
    borderTop: '1px solid #FFC0C1'
  },
  sidebarPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sidebarPanelTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#323244'
  },
  viewAllLink: {
    fontSize: '0.82rem',
    color: 'var(--primary-teal)',
    fontWeight: 700
  },
  infoTagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginBottom: '1.2rem'
  },
  infoTag: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#323244',
    backgroundColor: '#EDF2F7',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px'
  },
  groupInfoStatsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    borderTop: '1px solid var(--border-soft)',
    paddingTop: '1rem'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  statLabel: {
    color: '#20BEE8',
    fontWeight: 500
  },
  statValue: {
    color: '#323244',
    fontWeight: 700
  },
  // Modal viewer on front page
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(93, 109, 88, 0.4)',
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
    border: '1px solid rgba(32, 190, 232, 0.15)',
    boxShadow: '0 20px 45px rgba(93,109,88,0.12)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#323244',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#FAF9F6'
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#323244'
  },
  crisisList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem'
  },
  crisisItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    backgroundColor: '#FFC0C1',
    padding: '0.8rem 1.2rem',
    borderRadius: '12px',
    border: '1px solid #FFC0C1'
  },
  phoneLink: {
    fontSize: '0.98rem',
    fontWeight: 800,
    color: '#323244'
  },
  commBannerIllustration: {
    maxHeight: '140px',
    maxWidth: '220px',
    objectFit: 'contain',
    margin: '0 1.5rem'
  }
};
