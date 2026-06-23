'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Send, Mic, MicOff, Settings, X, MessageSquare, AlertCircle, Heart, Phone, Award, Smile } from 'lucide-react';
import { dbService } from '../lib/supabase';
import { Profile } from '../lib/types';

interface Message {
  role: 'user' | 'buddy';
  text: string;
  timestamp: string;
}

// Custom rendered SVG Avatars for reliability
const AvatarSVG = ({ type }: { type: string }) => {
  if (type === 'avatar2') {
    // Wise avatar - zen face
    return (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#FAF9F6" stroke="#20BEE8" strokeWidth="4"/>
        <path d="M30 45C33 48 37 48 40 45" stroke="#323244" strokeWidth="5" strokeLinecap="round"/>
        <path d="M60 45C63 48 67 48 70 45" stroke="#323244" strokeWidth="5" strokeLinecap="round"/>
        <path d="M40 65C45 68 55 68 60 65" stroke="#323244" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="10" stroke="#FFC0C1" strokeWidth="2" strokeDasharray="3 3"/>
      </svg>
    );
  }
  if (type === 'avatar3') {
    // Active avatar - wink / energetic face
    return (
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#FFC0C1" stroke="#20BEE8" strokeWidth="4"/>
        <path d="M30 48C35 48 40 48 40 48" stroke="#323244" strokeWidth="6" strokeLinecap="round"/>
        <path d="M62 43C65 47 68 47 70 43" stroke="#323244" strokeWidth="5" strokeLinecap="round"/>
        <path d="M35 65C42 75 58 75 65 65" fill="#323244" stroke="#323244" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  // Default cute avatar - smiling blushing cheeks
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FAF9F6" stroke="#20BEE8" strokeWidth="4"/>
      <circle cx="35" cy="45" r="5" fill="#323244"/>
      <circle cx="65" cy="45" r="5" fill="#323244"/>
      <circle cx="28" cy="52" r="6" fill="#FFC0C1" opacity="0.8"/>
      <circle cx="72" cy="52" r="6" fill="#FFC0C1" opacity="0.8"/>
      <path d="M42 58C45 61 55 61 58 58" stroke="#323244" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
};

export default function Buddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Customization settings
  const [buddyName, setBuddyName] = useState('Buddy');
  const [buddyAvatar, setBuddyAvatar] = useState('avatar1');
  const [buddyPersonality, setBuddyPersonality] = useState('Cheerful');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load configuration and chat memory
  useEffect(() => {
    const loadBuddyData = async () => {
      const isLoggedIn = localStorage.getItem('th_logged_in') === 'true';
      const profile = await dbService.getProfile(isLoggedIn ? 'user123' : 'guest');
      
      setBuddyName(profile.buddy_name || 'Buddy');
      setBuddyAvatar(profile.buddy_avatar || 'avatar1');
      setBuddyPersonality(profile.buddy_personality || 'Cheerful');

      // Load messages
      const savedMessages = localStorage.getItem('th_buddy_chats');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const welcomeText = profile.buddy_personality === 'Cheerful'
          ? `Hey dost! Main hoon aapka ${profile.buddy_name || 'Buddy'}. Aaj kya chal raha hai aapke mind mein? Share karo! 😊`
          : profile.buddy_personality === 'Wise'
            ? `Namaste. Main yahan aapki baatein sunne ke liye hoon. Koi tension ya baat jo aap share karna chahein? 🕊️`
            : `Hello. Take a deep breath. I am here to listen and help you feel supported. How was your day? 🌿`;
        
        const initial = [{ role: 'buddy' as const, text: welcomeText, timestamp: new Date().toISOString() }];
        setMessages(initial);
        localStorage.setItem('th_buddy_chats', JSON.stringify(initial));
      }
    };

    loadBuddyData();

    // Listen to profile updates
    const handleProfileUpdate = () => {
      loadBuddyData();
    };
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('moodChanged', handleProfileUpdate);
    window.addEventListener('openBuddyChat', handleOpenChat);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('moodChanged', handleProfileUpdate);
      window.removeEventListener('openBuddyChat', handleOpenChat);
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'hi-IN'; // Set to Hindi/English mix support

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev + ' ' + transcript);
          setIsListening(false);
        };

        rec.onerror = (e: any) => {
          console.error('Speech recognition error:', e);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice transcription is not supported in this browser. Please try Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');

    // Append user message
    const userMsg: Message = { role: 'user', text: userText, timestamp: new Date().toISOString() };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    localStorage.setItem('th_buddy_chats', JSON.stringify(updatedMsgs));

    setLoading(true);

    // Get selected mood
    const currentMood = localStorage.getItem('th_selected_mood') || 'Calm';

    try {
      const response = await fetch('/api/buddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          mood: currentMood,
          buddyConfig: {
            name: buddyName,
            avatar: buddyAvatar,
            personality: buddyPersonality
          }
        })
      });

      const data = await response.json();

      if (data.reply === 'SAFETY_CRISIS_TRIGGER' || data.isCrisis) {
        // Trigger crisis intervention
        setShowCrisisModal(true);
        const alertMsg: Message = {
          role: 'buddy',
          text: 'Dost, please know that your life is extremely precious. I am here to support you, but it is important to speak with professionals right now. Check out the resources below or talk to our counselors. ❤️',
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, alertMsg]);
        setLoading(false);
        return;
      }

      // Add Buddy reply
      const buddyMsg: Message = { role: 'buddy', text: data.reply, timestamp: new Date().toISOString() };
      const nextMsgs = [...updatedMsgs, buddyMsg];
      setMessages(nextMsgs);
      localStorage.setItem('th_buddy_chats', JSON.stringify(nextMsgs));

      // Award Points for interacting (limit to once per few mins, simulated)
      const isLoggedIn = localStorage.getItem('th_logged_in') === 'true';
      await dbService.addPoints(2, isLoggedIn ? 'user123' : 'guest');
      window.dispatchEvent(new Event('profileUpdated'));

    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        role: 'buddy',
        text: 'Sorry dost, connection issues. Par main sun raha hoon, bolte raho! 🌿',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('th_logged_in') === 'true';
    await dbService.updateProfile({
      buddy_name: buddyName,
      buddy_avatar: buddyAvatar,
      buddy_personality: buddyPersonality
    }, isLoggedIn ? 'user123' : 'guest');
    
    // Add system notification in chat
    const alertMsg: Message = {
      role: 'buddy',
      text: `Buddy settings updated! My name is now ${buddyName} and my style is ${buddyPersonality}. ✨`,
      timestamp: new Date().toISOString()
    };
    const nextMsgs = [...messages, alertMsg];
    setMessages(nextMsgs);
    localStorage.setItem('th_buddy_chats', JSON.stringify(nextMsgs));

    setShowSettings(false);
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const clearChat = () => {
    const welcome = `Chat reset! Let's start fresh, dost. What's on your mind? 😊`;
    const initial = [{ role: 'buddy' as const, text: welcome, timestamp: new Date().toISOString() }];
    setMessages(initial);
    localStorage.setItem('th_buddy_chats', JSON.stringify(initial));
  };

  return (
    <>
      {/* Floating Buddy Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          style={styles.floatingBtn}
          className="btn animate-float"
        >
          <div style={styles.floatingAvatar}>
            <AvatarSVG type={buddyAvatar} />
          </div>
          <span style={styles.floatingLabel}>Talk to {buddyName}</span>
        </button>
      )}

      {/* Main Chat Drawer */}
      {isOpen && (
        <div style={styles.chatDrawer} className="animate-pop buddy-chat-drawer">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <AvatarSVG type={buddyAvatar} />
              <div style={{ marginLeft: '10px' }}>
                <h4 style={styles.buddyNameText}>{buddyName}</h4>
                <span style={styles.statusDot}>{buddyPersonality} Friend</span>
              </div>
            </div>
            <div style={styles.headerActions}>
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                style={styles.actionBtn}
                title="Settings"
              >
                <Settings size={18} color="#323244" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                style={styles.actionBtn}
                title="Minimize"
              >
                <X size={18} color="#323244" />
              </button>
            </div>
          </div>

          {/* Settings Section (Slide-over) */}
          {showSettings ? (
            <form onSubmit={handleSaveSettings} style={styles.settingsForm}>
              <h3 style={styles.settingsTitle}>Customize Buddy</h3>
              
              <div style={styles.formGroup}>
                <label>Buddy Name</label>
                <input 
                  type="text" 
                  value={buddyName}
                  onChange={(e) => setBuddyName(e.target.value)}
                  placeholder="E.g., Buddy, Dost, Dosty" 
                  maxLength={15}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label>Avatar Style</label>
                <div style={styles.avatarGrid}>
                  {['avatar1', 'avatar2', 'avatar3'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setBuddyAvatar(av)}
                      style={{
                        ...styles.avatarOptionBtn,
                        borderColor: buddyAvatar === av ? '#20BEE8' : 'transparent',
                        backgroundColor: buddyAvatar === av ? '#FAF9F6' : 'rgba(0,0,0,0.02)'
                      }}
                    >
                      <AvatarSVG type={av} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label>Personality Style</label>
                <select 
                  value={buddyPersonality}
                  onChange={(e) => setBuddyPersonality(e.target.value)}
                >
                  <option value="Cheerful">Cheerful 😊 (Optimistic, energetic)</option>
                  <option value="Calm">Calm 😌 (Soothing, peaceful)</option>
                  <option value="Wise">Wise 🌿 (Understanding, reflective)</option>
                </select>
              </div>

              <div style={styles.settingsActions}>
                <button type="button" onClick={clearChat} style={styles.resetBtn} className="btn">
                  Clear Chat
                </button>
                <button type="submit" style={styles.saveBtn} className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          ) : (
            /* Chat Area */
            <div style={styles.chatArea}>
              <div style={styles.messagesContainer}>
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.msgWrapper,
                      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {m.role === 'buddy' && (
                      <div style={styles.msgAvatar}>
                        <AvatarSVG type={buddyAvatar} />
                      </div>
                    )}
                    <div 
                      style={{
                        ...styles.bubble,
                        backgroundColor: m.role === 'user' ? '#FFC0C1' : '#20BEE8',
                        color: '#323244',
                        borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        border: 'none'
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={styles.msgWrapper}>
                    <div style={styles.msgAvatar}>
                      <AvatarSVG type={buddyAvatar} />
                    </div>
                    <div style={{ ...styles.bubble, backgroundColor: '#20BEE8', color: '#323244', border: 'none' }}>
                      <span className="animate-pulse-slow">Buddy is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={styles.inputArea}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Reply in English/Hindi...`}
                  disabled={loading}
                  style={styles.chatInput}
                />
                
                <button 
                  type="button" 
                  onClick={handleVoiceInput}
                  style={{
                    ...styles.micBtn,
                    backgroundColor: isListening ? '#FFC0C1' : 'transparent',
                    color: '#323244'
                  }}
                  title={isListening ? "Listening..." : "Voice Input"}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button type="submit" disabled={!input.trim() || loading} style={styles.sendBtn}>
                  <Send size={18} color="#323244" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Safety Intercept Modal */}
      {showCrisisModal && (
        <div style={styles.crisisOverlay}>
          <div style={styles.crisisCard} className="animate-pop card">
            <div style={styles.crisisHeader}>
              <AlertCircle size={32} color="#323244" />
              <h2 style={styles.crisisTitle}>You Are Important To Us ❤️</h2>
            </div>
            <p style={styles.crisisText}>
              Hey, please know that you are not alone, and there is help available. It's okay to feel overwhelmed, but speaking to a trained crisis counselor is the best way to stay safe.
            </p>
            <div style={styles.crisisHelplines}>
              <div style={styles.crisisHelplineItem}>
                <span style={styles.hlLabel}>AASRA Suicide Support (24/7 India)</span>
                <a href="tel:+919820466726" style={styles.hlLink}><Phone size={14} /> +91-9820466726</a>
              </div>
              <div style={styles.crisisHelplineItem}>
                <span style={styles.hlLabel}>Vandrevala Foundation (24/7)</span>
                <a href="tel:+919999666555" style={styles.hlLink}><Phone size={14} /> +91-9999666555</a>
              </div>
            </div>
            <p style={styles.crisisSecondaryText}>
              You can also click below to instantly request a text counselor session on this platform.
            </p>
            <div style={styles.crisisActions}>
              <button onClick={() => setShowCrisisModal(false)} style={styles.crisisCloseBtn} className="btn">
                Close & Go Back
              </button>
              <button 
                onClick={() => {
                  setShowCrisisModal(false);
                  window.location.href = '/counselors';
                }} 
                style={styles.crisisActionBtn} 
                className="btn btn-primary"
              >
                Book Instant Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  floatingBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#FAF9F6',
    border: '1px solid #FFC0C1',
    boxShadow: '0 8px 30px rgba(50, 50, 68, 0.08)',
    padding: '0.6rem 1.2rem',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    zIndex: 90,
    transition: 'all 0.3s'
  },
  floatingAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  floatingLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#20BEE8'
  },
  chatDrawer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '380px',
    height: '520px',
    backgroundColor: '#FAF9F6',
    border: '1px solid #FFC0C1',
    borderRadius: '24px',
    boxShadow: '0 12px 40px rgba(50, 50, 68, 0.12)',
    zIndex: 95,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #FFC0C1',
    backgroundColor: '#FAF9F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  buddyNameText: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#323244',
    lineHeight: 1.2
  },
  statusDot: {
    fontSize: '0.75rem',
    color: '#20BEE8',
    fontWeight: 500
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
  },
  messagesContainer: {
    flexGrow: 1,
    padding: '1.2rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    backgroundColor: '#FAF9F6'
  },
  msgWrapper: {
    display: 'flex',
    gap: '0.6rem',
    maxWidth: '85%',
    alignItems: 'flex-start'
  },
  msgAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    marginTop: '4px'
  },
  bubble: {
    padding: '0.75rem 1rem',
    fontSize: '0.92rem',
    lineHeight: 1.4,
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  inputArea: {
    padding: '0.8rem',
    borderTop: '1px solid #FFC0C1',
    backgroundColor: '#FAF9F6',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexShrink: 0
  },
  chatInput: {
    flexGrow: 1,
    padding: '0.6rem 1rem',
    borderRadius: '24px',
    fontSize: '0.9rem',
    border: '1px solid var(--border-color)',
    height: '38px'
  },
  micBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  sendBtn: {
    backgroundColor: '#20BEE8',
    border: 'none',
    cursor: 'pointer',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 0.2s'
  },
  settingsForm: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    flexGrow: 1,
    overflowY: 'auto'
  },
  settingsTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#323244',
    marginBottom: '0.4rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatarGrid: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.4rem'
  },
  avatarOptionBtn: {
    padding: '0.4rem',
    borderRadius: '16px',
    border: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  settingsActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid #FFC0C1'
  },
  resetBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    backgroundColor: '#FFC0C1',
    color: '#323244',
    border: '1px solid #323244',
    borderRadius: '50px'
  },
  saveBtn: {
    padding: '0.5rem 1.2rem',
    fontSize: '0.85rem'
  },
  crisisOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(50, 50, 68, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  crisisCard: {
    backgroundColor: '#FAF9F6',
    maxWidth: '520px',
    width: '100%',
    padding: '2.5rem',
    borderRadius: '28px',
    border: '2px solid #FFC0C1',
    boxShadow: '0 20px 40px rgba(50, 50, 68, 0.1)'
  },
  crisisHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1rem'
  },
  crisisTitle: {
    color: '#323244',
    fontSize: '1.4rem',
    fontWeight: 800
  },
  crisisText: {
    fontSize: '1rem',
    color: '#323244',
    lineHeight: 1.5,
    marginBottom: '1.5rem'
  },
  crisisHelplines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  crisisHelplineItem: {
    backgroundColor: '#FFC0C1',
    border: '1px solid #20BEE8',
    borderRadius: '16px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  hlLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#323244',
    textTransform: 'uppercase',
    opacity: 0.8
  },
  hlLink: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#323244',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  crisisSecondaryText: {
    fontSize: '0.88rem',
    color: '#323244',
    marginBottom: '1.5rem',
    lineHeight: 1.4,
    opacity: 0.8
  },
  crisisActions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  crisisCloseBtn: {
    flexGrow: 1,
    padding: '0.7rem',
    fontSize: '0.9rem',
    border: '1px solid #323244',
    backgroundColor: '#FAF9F6',
    color: '#323244'
  },
  crisisActionBtn: {
    flexGrow: 1,
    padding: '0.7rem',
    fontSize: '0.9rem'
  }
};
