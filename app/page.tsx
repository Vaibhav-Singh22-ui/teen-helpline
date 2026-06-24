'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, MessageCircle, BookOpen, Smile, Sparkles, Award, ArrowRight, Heart, RefreshCw, Book, X, Play } from 'lucide-react';
import { dbService } from '../lib/supabase';
import { CommunityPost } from '../lib/types';
import MoodSelection from '../components/MoodSelection';

// Selected popular articles to showcase on the home page
const HOMEPAGE_ARTICLES = [
  {
    id: 'a1',
    title: 'How to manage anxiety',
    category: 'Anxiety',
    readTime: '4 min read',
    snippet: 'Anxiety can feel overwhelming, but there are some simple steps you can follow to help soothe your nervous system, regulate breathing, and center your thoughts.',
    content: 'Anxiety is our body\'s natural response to stress, but sometimes it becomes hyperactive. To manage it, start with grounding techniques like the 5-4-3-2-1 method: identify 5 things you see, 4 things you touch, 3 things you hear, 2 things you smell, and 1 thing you taste. Combine this with box breathing (inhale for 4s, hold for 4s, exhale for 4s, hold for 4s) to signal safety to your brain.',
    image: '/media__1782243930117.png'
  },
  {
    id: 'a2',
    title: 'Why do I freak out when I\'m stressed?',
    category: 'Stress',
    readTime: '5 min read',
    snippet: 'To work out why you\'re feeling anxious or hyperactive under pressure, it can be really helpful to understand what\'s happening in your brain.',
    content: 'When stress strikes, a tiny alarm system in your brain called the amygdala takes over. It triggers a fight-or-flight response, releasing adrenaline and cortisol. This is why you might feel your heart racing or your mind going blank. Recognizing that this is a physiological response—not a personal failure—helps you take back control. Take a pause, step away from your books, and let your body settle.',
    image: '/media__1782243930025.png'
  },
  {
    id: 'a5',
    title: 'Why can\'t I focus at school?',
    category: 'Stress',
    readTime: '4 min read',
    snippet: 'Stress and constant notifications can make it difficult to concentrate, learn, and feel motivated. Here are some scientific tips to regain focus.',
    content: 'Our brains are not wired for multitasking. Constant phone alerts fragment our attention span. Try the "Focus Quest" Pomodoro method: study for 20 minutes with zero distractions, then take a 5-minute offline break. Drinking water, sitting near natural light, and sleeping at least 8 hours are proven to dramatically improve concentration.',
    image: '/media__1782243930061.png'
  }
];

const getStoryImage = (id: number | string) => {
  const numId = Number(id);
  if (numId === 1) return '/media__1782243930117.png';
  if (numId === 2) return '/media__1782243930061.png';
  return '/media__1782243929921.png';
};

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [activeStory, setActiveStory] = useState<any | null>(null);

  useEffect(() => {
    dbService.initialize();

    // Check saved mood
    const savedMood = localStorage.getItem('th_selected_mood');
    if (savedMood) {
      setSelectedMood(savedMood);
    } else {
      setShowMoodSelector(true);
    }

    // Load data
    const loadHomeData = async () => {
      const dbPosts = await dbService.getCommunityPosts();
      setPosts(dbPosts.slice(0, 3)); // show top 3 posts
      setStories(dbService.getSuccessStories());
    };

    loadHomeData();

    const handleMoodChange = () => {
      setSelectedMood(localStorage.getItem('th_selected_mood'));
    };
    window.addEventListener('moodChanged', handleMoodChange);

    return () => {
      window.removeEventListener('moodChanged', handleMoodChange);
    };
  }, []);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodSelector(false);
  };

  const openBuddyChat = () => {
    window.dispatchEvent(new Event('openBuddyChat'));
  };

  // Dynamic Content according to selected mood
  const renderMoodAdaptation = () => {
    if (!selectedMood) return null;

    switch (selectedMood) {
      case 'Sad':
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782218276419.png" alt="Sad Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>A Soft Hug For You</h3>
              <p style={styles.moodQuoteText}>"Remember: even the rainiest clouds eventually run out of water! 🌧️➡️☀️"</p>
              <div style={styles.moodBannerActions}>
                <Link href="/calm-zone" style={styles.moodBtn} className="btn btn-secondary">
                  Play Bubble Burst
                </Link>
                <button onClick={openBuddyChat} style={styles.moodBtnTeal} className="btn btn-primary">
                  Comforting Chat with Buddy
                </button>
              </div>
            </div>
          </div>
        );
      case 'Anxious':
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782218276474.png" alt="Anxious Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>Let's Slow Things Down</h3>
              <p style={styles.moodQuoteText}>"Inhale peace, exhale the chaotic chatter. You are here, you are safe."</p>
              <div style={styles.moodBannerActions}>
                <Link href="/calm-zone" style={styles.moodBtn} className="btn btn-secondary">
                  Try Breathing Orbit
                </Link>
                <button onClick={openBuddyChat} style={styles.moodBtnTeal} className="btn btn-primary">
                  Calming Talk with Buddy
                </button>
              </div>
            </div>
          </div>
        );
      case 'Stressed':
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782218276491.png" alt="Stressed Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>One Task at a Time, Dost</h3>
              <p style={styles.moodQuoteText}>"Take a deep breath. You are capable of doing tough things, one step at a time! 🎒"</p>
              <div style={styles.moodBannerActions}>
                <Link href="/calm-zone" style={styles.moodBtn} className="btn btn-secondary">
                  Play Catch Positivity
                </Link>
                <Link href="/resources" style={styles.moodBtnTeal} className="btn btn-primary">
                  Study Stress Guide
                </Link>
              </div>
            </div>
          </div>
        );
      case 'Lonely':
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782194827509.png" alt="Lonely Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>You Are Not Alone Here</h3>
              <p style={styles.moodQuoteText}>"Dost, you are never alone. Buddy is always in your corner! 🤝"</p>
              <div style={styles.moodBannerActions}>
                <Link href="/community" style={styles.moodBtn} className="btn btn-secondary">
                  Browse Community Posts
                </Link>
                <button onClick={openBuddyChat} style={styles.moodBtnTeal} className="btn btn-primary">
                  Chat with Buddy
                </button>
              </div>
            </div>
          </div>
        );
      case 'Angry':
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782225726481.png" alt="Angry Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>Release the Heat</h3>
              <p style={styles.moodQuoteText}>"It's okay to blow off steam. Let's pop some bubbles and release the heat! 🌋"</p>
              <div style={styles.moodBannerActions}>
                <a href={process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'} target="_blank" rel="noopener noreferrer" style={styles.moodBtn} className="btn btn-secondary">
                  Write in Private Journal
                </a>
                <Link href="/calm-zone" style={styles.moodBtnTeal} className="btn btn-primary">
                  Play Bubble Burst
                </Link>
              </div>
            </div>
          </div>
        );
      case 'Happy':
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782194988151.png" alt="Happy Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>Keep the Light Shining!</h3>
              <p style={styles.moodQuoteText}>"Your joy is infectious! Share the vibe and keep shining bright! ⭐"</p>
              <div style={styles.moodBannerActions}>
                <Link href="/community" style={styles.moodBtn} className="btn btn-secondary">
                  Share Happiness
                </Link>
                <Link href="/calm-zone" style={styles.moodBtnTeal} className="btn btn-primary">
                  Interact with Mood Pet
                </Link>
              </div>
            </div>
          </div>
        );
      default: // Calm
        return (
          <div style={styles.moodBanner} className="animate-pop">
            <img src="/media__1782194988151.png" alt="Calm Vibe" style={styles.moodBannerIllust} />
            <div style={styles.moodBannerContent}>
              <h3 style={styles.moodBannerTitle}>Cherish This Peace</h3>
              <p style={styles.moodQuoteText}>"Peace looks beautiful on you. Keep relaxing, dost!"</p>
              <div style={styles.moodBannerActions}>
                <a href={process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'} target="_blank" rel="noopener noreferrer" style={styles.moodBtn} className="btn btn-secondary">
                  Go to Dashboard Journal
                </a>
                <Link href="/calm-zone" style={styles.moodBtnTeal} className="btn btn-primary">
                  Play Sleep Soundscapes
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Mood Selector Overlay */}
      <MoodSelection onMoodSelect={handleMoodSelect} forceShow={showMoodSelector} />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container hero-container-grid" style={styles.heroContainer}>
          <div style={styles.heroContent}>
            {selectedMood && (
              <div style={styles.moodIndicator}>
                <span>Feeling: <strong>{selectedMood}</strong></span>
                <button onClick={() => setShowMoodSelector(true)} style={styles.changeMoodBtn}>
                  <RefreshCw size={12} /> Change
                </button>
              </div>
            )}
            <h1 style={styles.heroTitle}>You're Not Alone.</h1>
            <p style={styles.heroSubtitle}>
              A safe place where teenagers can talk freely, heal, grow, and find support without fear of judgment.
            </p>
            <div style={styles.heroActions}>
              <button onClick={openBuddyChat} style={styles.heroPrimaryBtn} className="btn btn-primary">
                <Smile size={18} /> Talk To Buddy
              </button>
              <Link href="/calm-zone" style={styles.heroSecondaryBtn} className="btn btn-secondary">
                <Compass size={18} /> Explore Calm Zone
              </Link>
            </div>
          </div>

          <div style={styles.heroImageWrapper}>
            <img
              src="/media__1782194988151.png"
              alt="Safest Place for Teenagers to Heal"
              style={styles.heroIllustrationImg}
            />
          </div>
        </div>
      </section>

      {/* Dynamic Mood adaptation section */}
      {selectedMood && (
        <section className="section-padding" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid rgba(32, 190, 232, 0.15)' }}>
          <div className="container">
            <h2 style={styles.sectionTitle}>Tailored For Your Mood</h2>
            {renderMoodAdaptation()}
          </div>
        </section>
      )}

      {/* Calm Zone Quick Links */}
      <section className="section-padding" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>The Calm Zone</h2>

          <div className="grid-3">
            <div className="card card-hover" style={styles.calmCard}>
              <div style={styles.calmCardIcon}>🌬️</div>
              <h3 style={styles.calmCardTitle}>Breathing Orbit</h3>
              <p style={styles.calmCardText}>A simple guided breathing bubble. Breathe in, hold, and release to calm anxiety.</p>
              <Link href="/calm-zone" style={styles.cardLink}>Try Activity →</Link>
            </div>
            <div className="card card-hover" style={styles.calmCard}>
              <div style={styles.calmCardIcon}>🌊</div>
              <h3 style={styles.calmCardTitle}>Ocean Drift</h3>
              <p style={styles.calmCardText}>Interact with calming ocean waves. Touch to create soothing ripples.</p>
              <Link href="/calm-zone" style={styles.cardLink}>Try Activity →</Link>
            </div>
            <div className="card card-hover" style={styles.calmCard}>
              <div style={styles.calmCardIcon}>🫧</div>
              <h3 style={styles.calmCardTitle}>Bubble Burst</h3>
              <p style={styles.calmCardText}>Pop pastel stress bubbles. A satisfying tactile stress reliever.</p>
              <Link href="/calm-zone" style={styles.cardLink}>Try Activity →</Link>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/calm-zone" className="btn btn-primary">
              View All 7 Games & Activities
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Resource Hub Blog Cards Section (Placed Prominently on Front Page) */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid rgba(32, 190, 232, 0.15)' }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Mindfulness & Wellness Articles</h2>
          <div className="grid-3">
            {HOMEPAGE_ARTICLES.map((art) => (
              <div key={art.id} className="card card-hover" style={styles.articleCard}>
                <div style={styles.imageContainer}>
                  <img src={art.image} alt={art.title} style={styles.articleImage} />
                  <span style={styles.categoryBadge}>{art.category}</span>
                </div>
                <div style={styles.articleBody}>
                  <span style={styles.readTime}>{art.readTime}</span>
                  <h3 style={styles.articleTitle}>{art.title}</h3>
                  <button onClick={() => setActiveArticle(art)} style={styles.readLink}>
                    READ ME <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/resources" className="btn btn-secondary">
              <BookOpen size={16} /> Explore All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Real Stories. Anonymous Healing.</h2>
          <div className="grid-3">
            {stories.map((story) => (
              <div key={story.id} className="card card-hover" style={styles.storyCard}>
                <div style={styles.imageContainer}>
                  <img src={getStoryImage(story.id)} alt={story.title} style={styles.articleImage} />
                  <span style={styles.categoryBadge}>{story.mood} Support</span>
                </div>
                <div style={styles.storyBody}>
                  <h3 style={styles.storyCardTitle}>{story.title}</h3>
                  <button onClick={() => setActiveStory(story)} style={styles.readLink}>
                    READ STORY <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </button>
                  <div style={styles.storyMeta}>
                    <span>Age {story.age} (Anonymous)</span>
                    <span style={styles.counselorNote}>Helped by {story.counselor_helped}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buddy Companion Card */}
      <section className="section-padding" style={{ backgroundColor: '#FAF9F6' }}>
        <div className="container">
          <div className="card" style={styles.buddyCompactCard}>
            <img src="/media__1782194988151.png" alt="Meet Buddy" style={styles.buddyCompactImg} />
            <div style={styles.buddyCompactContent}>
              <div style={styles.infoBadge}>
                <Sparkles size={16} /> <span>Your 24/7 Companion</span>
              </div>
              <h2 style={styles.buddyCompactTitle}>Meet Buddy: Your AI Friend</h2>
              <p style={styles.buddyCompactDesc}>
                A supportive, non-judgmental friend in your corner who speaks English, Hindi, and Hinglish.
              </p>
              <button onClick={openBuddyChat} className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                Chat with Buddy <MessageCircle size={16} style={{ marginLeft: '6px' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Board Snippets */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid rgba(32, 190, 232, 0.15)' }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Anonymous Community Board</h2>
          <p style={styles.sectionSubtitle}>
            Share your thoughts, ask questions, or respond to others without sharing your real name. Fully moderated for safety.
          </p>
          <div style={styles.postList}>
            {posts.map((post) => (
              <div key={post.id} className="card" style={styles.postCard}>
                <div style={styles.postHeader}>
                  <span style={styles.postAuthor}>👤 {post.author_pseudonym}</span>
                  {post.mood_tag && (
                    <span className={`tag tag-${post.mood_tag.toLowerCase()}`}>{post.mood_tag}</span>
                  )}
                </div>
                <p style={styles.postContent}>{post.content}</p>
                <div style={styles.postFooter}>
                  <span>❤️ {post.likes} Hearts</span>
                  <Link href="/community" style={styles.replyLink}>
                    View & Write Reply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/community" className="btn btn-secondary">
              Go to Community Board
            </Link>
          </div>
        </div>
      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div style={styles.modalOverlay} onClick={() => setActiveArticle(null)}>
          <div style={styles.modalCard} className="card animate-pop" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span className="tag tag-calm" style={{ marginBottom: '0.5rem' }}>{activeArticle.category}</span>
              <button onClick={() => setActiveArticle(null)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <h2 style={styles.modalTitle}>{activeArticle.title}</h2>
            <div style={{ display: 'flex', gap: '0.8rem', color: '#20BEE8', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.2rem' }}>
              <span>{activeArticle.readTime}</span>
              <span>•</span>
              <span>Written by Counselor Team</span>
            </div>
            <div style={styles.modalImageWrapper}>
              <img src={activeArticle.image} alt={activeArticle.title} style={styles.modalImage} />
            </div>
            <div style={styles.modalContent}>
              <p style={{ lineHeight: 1.6, fontSize: '0.98rem', color: '#323244' }}>
                {activeArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Story Reader Modal */}
      {activeStory && (
        <div style={styles.modalOverlay} onClick={() => setActiveStory(null)}>
          <div style={styles.modalCard} className="card animate-pop" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span className="tag tag-stressed" style={{ marginBottom: '0.5rem' }}>{activeStory.mood} Support</span>
              <button onClick={() => setActiveStory(null)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <h2 style={styles.modalTitle}>{activeStory.title}</h2>
            <div style={{ display: 'flex', gap: '0.8rem', color: '#20BEE8', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.2rem' }}>
              <span>Age {activeStory.age} (Anonymous)</span>
              <span>•</span>
              <span>Helped by {activeStory.counselor_helped}</span>
            </div>
            <div style={styles.modalImageWrapper}>
              <img src={getStoryImage(activeStory.id)} alt={activeStory.title} style={styles.modalImage} />
            </div>
            <div style={styles.modalContent}>
              <p style={{ lineHeight: 1.6, fontSize: '0.98rem', color: '#323244', fontStyle: 'italic' }}>
                "{activeStory.story}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heroSection: {
    backgroundColor: '#FAF9F6',
    padding: '4rem 0 3rem 0',
    borderBottom: '1px solid rgba(32, 190, 232, 0.15)'
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '3rem',
    alignItems: 'center'
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  moodIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: '#FAF9F6',
    color: '#20BEE8',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    fontSize: '0.9rem',
    width: 'fit-content',
    border: '1px solid rgba(32, 190, 232, 0.15)'
  },
  changeMoodBtn: {
    background: 'none',
    border: 'none',
    color: '#20BEE8',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.85rem'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    color: '#323244',
    letterSpacing: '-1.5px',
    lineHeight: '1.1'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#323244',
    lineHeight: '1.6',
    maxWidth: '550px'
  },
  heroActions: {
    display: 'flex',
    gap: '1.2rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  heroPrimaryBtn: {
    padding: '0.9rem 2rem',
    fontSize: '1.05rem'
  },
  heroSecondaryBtn: {
    padding: '0.9rem 2rem',
    fontSize: '1.05rem'
  },
  heroImageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    textAlign: 'center',
    color: '#323244',
    marginBottom: '2.5rem'
  },
  sectionTitleBuddy: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#323244',
    marginBottom: '0.5rem'
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: '#323244',
    textAlign: 'center',
    maxWidth: '650px',
    margin: '0 auto 3rem auto',
    lineHeight: '1.5'
  },
  sectionSubtitleBuddy: {
    fontSize: '1.05rem',
    color: '#323244',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  moodBanner: {
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--border-color)',
    borderRadius: '28px',
    padding: '2.5rem',
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    boxShadow: 'var(--card-shadow)',
    maxWidth: '900px',
    margin: '0 auto'
  },
  moodBannerIllust: {
    width: '140px',
    height: '140px',
    objectFit: 'contain',
    flexShrink: 0,
    backgroundColor: 'var(--bg-sand)',
    borderRadius: '20px',
    padding: '0.4rem',
    border: '1px solid var(--border-color)'
  },
  moodQuoteText: {
    fontSize: '0.98rem',
    fontWeight: 700,
    color: 'var(--primary-teal)',
    fontStyle: 'italic',
    lineHeight: 1.4,
    margin: '0.2rem 0'
  },
  moodBannerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  moodBannerTitle: {
    fontSize: '1.4rem',
    color: '#323244',
    fontWeight: 700
  },
  moodBannerText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#323244'
  },
  moodBannerActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  moodBtn: {
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem'
  },
  moodBtnTeal: {
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem'
  },
  infoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: '#FFC0C1',
    color: '#323244',
    border: '1px solid #FFC0C1',
    padding: '0.4rem 0.8rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: 600,
    width: 'fit-content'
  },
  buddyCompactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
    padding: '2.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    border: '1.5px solid var(--border-color)',
    maxWidth: '900px',
    margin: '0 auto',
    flexWrap: 'wrap'
  },
  buddyCompactImg: {
    width: '180px',
    height: '180px',
    objectFit: 'contain',
    backgroundColor: '#FAF9F6',
    borderRadius: '20px',
    padding: '0.5rem',
    border: '1px solid var(--border-color)',
    flexShrink: 0
  },
  buddyCompactContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    flex: '1 1 300px'
  },
  buddyCompactTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#323244'
  },
  buddyCompactDesc: {
    fontSize: '1.05rem',
    color: '#323244',
    lineHeight: 1.5
  },
  calmCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    alignItems: 'center',
    textAlign: 'center'
  },
  calmCardIcon: {
    fontSize: '3rem',
    lineHeight: 1
  },
  calmCardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#323244'
  },
  calmCardText: {
    fontSize: '0.92rem',
    lineHeight: 1.5,
    color: '#323244'
  },
  cardLink: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#20BEE8',
    marginTop: '0.5rem',
    display: 'block'
  },
  storyCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  storyTag: {
    alignSelf: 'flex-start'
  },
  storyCardTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#323244',
    lineHeight: 1.3
  },
  storyCardText: {
    fontSize: '0.95rem',
    lineHeight: 1.5,
    color: '#323244',
    fontStyle: 'italic'
  },
  storyBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flexGrow: 1
  },
  storyMeta: {
    borderTop: '1px solid rgba(32, 190, 232, 0.15)',
    paddingTop: '0.8rem',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    fontSize: '0.8rem',
    color: '#20BEE8',
    fontWeight: 500
  },
  counselorNote: {
    color: '#20BEE8',
    fontWeight: 600
  },
  postList: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  postCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    fontWeight: 600
  },
  postAuthor: {
    color: '#323244'
  },
  postContent: {
    fontSize: '0.98rem',
    color: '#323244',
    lineHeight: 1.5
  },
  postFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#20BEE8',
    fontWeight: 600,
    borderTop: '1px solid rgba(143,158,139,0.08)',
    paddingTop: '0.6rem'
  },
  replyLink: {
    color: '#20BEE8'
  },
  heroIllustrationImg: {
    width: '100%',
    maxHeight: '320px',
    objectFit: 'contain'
  },
  // Blog cards styling on front page
  articleCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  },
  imageContainer: {
    position: 'relative',
    height: '180px',
    width: '100%',
    backgroundColor: '#FAF9F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem'
  },
  articleImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#FAF9F6',
    color: '#20BEE8',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  articleBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexGrow: 1
  },
  readTime: {
    fontSize: '0.78rem',
    color: '#20BEE8',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  articleTitle: {
    fontSize: '1.15rem',
    color: '#323244',
    fontWeight: 800,
    lineHeight: 1.3
  },
  articleSnippet: {
    fontSize: '0.88rem',
    color: '#323244',
    lineHeight: 1.45
  },
  readLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: '#20BEE8',
    fontWeight: 700,
    fontSize: '0.88rem',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: 'auto',
    textAlign: 'left',
    width: 'fit-content'
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
    maxWidth: '600px',
    width: '100%',
    padding: '2.5rem',
    borderRadius: '28px',
    border: '1px solid rgba(32, 190, 232, 0.15)',
    boxShadow: '0 20px 45px rgba(93,109,88,0.12)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
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
    backgroundColor: '#FAF9F6',
    marginLeft: 'auto'
  },
  modalTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#323244',
    lineHeight: 1.2
  },
  modalImageWrapper: {
    height: '240px',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '1.5rem',
    backgroundColor: '#FAF9F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  modalContent: {
    borderTop: '1px solid rgba(32, 190, 232, 0.15)',
    paddingTop: '1.2rem'
  }
};
