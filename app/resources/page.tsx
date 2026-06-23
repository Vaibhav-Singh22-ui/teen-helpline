'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Filter, Play, ExternalLink, ArrowRight } from 'lucide-react';

const ARTICLES = [
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
    id: 'a3',
    title: 'Your brain when you\'re anxious',
    category: 'Anxiety',
    readTime: '6 min read',
    snippet: 'The brain is very complex! But let\'s simplify things a bit to help you understand why anxiety occurs and how to gently calm it down.',
    content: 'During anxiety, the prefrontal cortex—the part of your brain responsible for logical thinking—goes offline, while the emotional centers (the limbic system) become loud. This makes small threats feel massive. Regular mindfulness exercises, like those in the Calm Zone, help strengthen the connection between these brain regions, allowing you to stay calm under pressure.',
    image: '/media__1782243929921.png'
  },
  {
    id: 'a4',
    title: 'My friend is unsafe at home',
    category: 'Relationships',
    readTime: '7 min read',
    snippet: 'You might learn (or suspect) a friend is experiencing family violence or abuse at home and not know how to support them safely.',
    content: 'Supporting a friend in a difficult home situation is stressful. First, listen without judgment. Do not promise absolute secrecy if their safety is at risk; instead, help them identify a trusted adult, school counselor, or volunteer mentor. Encourage them to contact the Child Helpline at 1098. Remember to take care of your own mental boundaries, too.',
    image: '/media__1782243930061.png'
  },
  {
    id: 'a5',
    title: 'Why can\'t I focus at school?',
    category: 'Stress',
    readTime: '4 min read',
    snippet: 'Stress and constant notifications can make it difficult to concentrate, learn, and feel motivated. Here are some scientific tips to regain focus.',
    content: 'Our brains are not wired for multitasking. Constant phone alerts fragment our attention span. Try the "Focus Quest" Pomodoro method: study for 20 minutes with zero distractions, then take a 5-minute offline break. Drinking water, sitting near natural light, and sleeping at least 8 hours are proven to dramatically improve concentration.',
    image: '/media__1782243930025.png'
  },
  {
    id: 'a6',
    title: 'I\'m worried about the environment',
    category: 'Anxiety',
    readTime: '5 min read',
    snippet: 'It\'s normal to feel worried about the environment and the climate change news you see on social media. Here is how to cope with eco-anxiety.',
    content: 'Eco-anxiety is a real phenomenon among teens. When global issues feel too massive, the best antidote is local, micro-actions. Join a school cleaning drive, plant seeds in a physical garden, or reduce personal plastic usage. Channeling anxiety into constructive, small habits helps restore a sense of agency and reduces feelings of helplessness.',
    image: '/media__1782243930139.png'
  }
];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // Filters
  const categories = ['All', 'Anxiety', 'Stress', 'Relationships'];

  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                          art.snippet.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.page}>
      <div className="container section-padding">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <BookOpen size={28} color="#20BEE8" />
          </div>
          <h1 style={styles.title}>Resource Hub</h1>
          <p style={styles.subtitle}>
            Read human-created and AI-assisted guides, articles, and watch videos designed to help you navigate school stress, relationships, and anxiety.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={styles.searchFilterBar}>
          <div style={styles.searchWrapper} className="search-filter-wrapper">
            <Search size={18} color="#20BEE8" style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search guides, e.g., 'exam', 'anxiety'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filtersWrapper}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...styles.filterBtn,
                  ...(activeCategory === cat ? styles.filterBtnActive : {})
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid-3" style={{ marginTop: '2rem' }}>
          {filteredArticles.map(art => (
            <div key={art.id} className="card card-hover" style={styles.articleCard}>
              <div style={styles.imageContainer}>
                <img src={art.image} alt={art.title} style={styles.articleImage} />
                <span style={styles.categoryBadge}>{art.category}</span>
              </div>
              <div style={styles.articleBody}>
                <span style={styles.readTime}>{art.readTime}</span>
                <h3 style={styles.articleTitle}>{art.title}</h3>
                <button onClick={() => setSelectedArticle(art)} style={styles.readLink}>
                  READ ME <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Resources Section */}
        <div style={styles.videoSection}>
          <h2 style={styles.videoTitle}>💆‍♂️ Mindfulness Video Sessions</h2>
          <p style={styles.videoSubtitle}>Watch these curated visual breathing and grounding guides to rest your eyes.</p>
          
          <div style={styles.videoGrid}>
            <div className="card" style={styles.videoCard}>
              <div style={styles.videoIllustrationContainer}>
                <img src="/media__1782243930117.png" alt="Breathing Visualizer" style={styles.videoIllustrationImg} />
                <div style={styles.playButtonOverlay}>
                  <Play size={24} color="#ffffff" fill="#ffffff" />
                </div>
              </div>
              <h4 style={styles.videoCardTitle}>Grounding Breath Sync</h4>
              <p style={styles.videoCardDesc}>Follow the organic waves to instantly calm your heartbeat.</p>
            </div>

            <div className="card" style={styles.videoCard}>
              <div style={styles.videoIllustrationContainer}>
                <img src="/media__1782243930139.png" alt="Focus Soundscapes" style={styles.videoIllustrationImg} />
                <div style={styles.playButtonOverlay}>
                  <Play size={24} color="#ffffff" fill="#ffffff" />
                </div>
              </div>
              <h4 style={styles.videoCardTitle}>Focus Audio Guide</h4>
              <p style={styles.videoCardDesc}>Soft, ambient rain soundscapes to mask distracting noises and retain memory.</p>
            </div>
          </div>
        </div>

        {/* Article Reader Modal */}
        {selectedArticle && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard} className="card animate-pop">
              <div style={styles.modalHeader}>
                <div>
                  <span className="tag tag-calm" style={{ marginBottom: '0.5rem' }}>{selectedArticle.category} Guide</span>
                  <h2 style={styles.modalTitle}>{selectedArticle.title}</h2>
                </div>
                <button onClick={() => setSelectedArticle(null)} style={styles.closeBtn}>
                  Close
                </button>
              </div>
              
              <div style={styles.modalContent}>
                <img src={selectedArticle.image} alt={selectedArticle.title} style={styles.modalImage} />
                <p style={styles.modalText}>{selectedArticle.content}</p>
                <div style={styles.modalFooter}>
                  <p style={{ fontWeight: 600 }}>Need deeper support?</p>
                  <p>You can chat with Buddy in the floating corner widget or book a free session with our verified mentors.</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => {
                        setSelectedArticle(null);
                        window.dispatchEvent(new Event('openBuddyChat'));
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Talk to Buddy
                    </button>
                    <Link 
                      href="/counselors" 
                      onClick={() => setSelectedArticle(null)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Browse Counselors
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: '#FAF9F6',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconContainer: {
    width: '54px',
    height: '54px',
    borderRadius: '18px',
    backgroundColor: '#FAF9F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(32, 190, 232, 0.15)',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#323244',
    letterSpacing: '-1px',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#323244',
    maxWidth: '700px',
    lineHeight: 1.5
  },
  searchFilterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    borderBottom: '1px solid rgba(32, 190, 232, 0.15)',
    paddingBottom: '1.5rem'
  },
  searchWrapper: {
    position: 'relative',
    flexGrow: 1,
    maxWidth: '450px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  searchInput: {
    paddingLeft: '2.5rem'
  },
  filtersWrapper: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    border: '1.5px solid var(--border-color)',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#323244',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    backgroundColor: '#20BEE8',
    borderColor: '#20BEE8',
    color: '#ffffff'
  },
  articleCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 0
  },
  imageContainer: {
    position: 'relative',
    height: '160px',
    width: '100%'
  },
  articleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(253, 251, 247, 0.95)',
    color: '#20BEE8',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: '10px'
  },
  articleBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flexGrow: 1
  },
  readTime: {
    fontSize: '0.75rem',
    color: '#20BEE8',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  articleTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#323244',
    lineHeight: 1.3
  },
  articleSnippet: {
    fontSize: '0.88rem',
    lineHeight: 1.4,
    color: '#323244',
    marginBottom: '1rem'
  },
  readLink: {
    background: 'none',
    border: 'none',
    color: '#20BEE8',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    alignSelf: 'flex-start',
    marginTop: 'auto',
    letterSpacing: '0.5px'
  },
  // Video Section
  videoSection: {
    marginTop: '5rem',
    borderTop: '1px solid rgba(32, 190, 232, 0.15)',
    paddingTop: '3.5rem'
  },
  videoTitle: {
    fontSize: '1.8rem',
    color: '#323244',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '0.4rem'
  },
  videoSubtitle: {
    fontSize: '0.98rem',
    color: '#323244',
    textAlign: 'center',
    marginBottom: '2.5rem'
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '850px',
    margin: '0 auto'
  },
  videoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  videoIllustrationContainer: {
    position: 'relative',
    height: '160px',
    backgroundColor: '#FAF9F6',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    border: '1.5px solid rgba(118, 115, 224, 0.15)',
    cursor: 'pointer'
  },
  videoIllustrationImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  playButtonOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(118, 115, 224, 0.85)',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    transition: 'all 0.2s'
  },
  videoCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#323244'
  },
  videoCardDesc: {
    fontSize: '0.88rem',
    color: '#323244',
    lineHeight: 1.4
  },
  // Modal css
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
    maxWidth: '650px',
    width: '100%',
    padding: '2.2rem',
    borderRadius: '28px',
    border: '1px solid rgba(32, 190, 232, 0.15)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(32, 190, 232, 0.15)',
    paddingBottom: '1rem'
  },
  modalTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#323244'
  },
  closeBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '50px',
    border: '1px solid #FFC0C1',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  modalImage: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
    borderRadius: '18px'
  },
  modalText: {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#323244'
  },
  modalFooter: {
    marginTop: '1.5rem',
    backgroundColor: '#FAF9F6',
    padding: '1.2rem',
    borderRadius: '18px',
    fontSize: '0.88rem',
    color: '#323244',
    lineHeight: 1.5
  }
};
