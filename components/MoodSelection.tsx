'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface MoodSelectionProps {
  onMoodSelect: (mood: string) => void;
  forceShow?: boolean;
}

const MOOD_OPTIONS = [
  { mood: 'Sad', emoji: '😢', desc: 'Need comfort & warmth', color: '#FFC0C1', textColor: '#323244', hoverColor: '#FFD3D4' },
  { mood: 'Stressed', emoji: '🤯', desc: 'Padhai/Exam tension', color: '#FFC0C1', textColor: '#323244', hoverColor: '#FFD3D4' },
  { mood: 'Lonely', emoji: '🥺', desc: 'Want someone to listen', color: '#FAF9F6', textColor: '#323244', hoverColor: '#FFC0C1' },
  { mood: 'Anxious', emoji: '😰', desc: 'Mind is racing', color: '#FFC0C1', textColor: '#323244', hoverColor: '#FFD3D4' },
  { mood: 'Angry', emoji: '😡', desc: 'Need to vent/let it out', color: '#FFC0C1', textColor: '#323244', hoverColor: '#FFD3D4' },
  { mood: 'Happy', emoji: '😊', desc: 'Feeling good & bright', color: '#20BEE8', textColor: '#323244', hoverColor: '#60D2F0' },
  { mood: 'Calm', emoji: '😌', desc: 'Just want to relax', color: '#20BEE8', textColor: '#323244', hoverColor: '#60D2F0' }
];

export default function MoodSelection({ onMoodSelect, forceShow = false }: MoodSelectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selected = localStorage.getItem('th_selected_mood');
      if (!selected || forceShow) {
        setVisible(true);
      }
    }
  }, [forceShow]);

  const handleSelect = (mood: string) => {
    localStorage.setItem('th_selected_mood', mood);
    setVisible(false);
    onMoodSelect(mood);
    // Dispatch event to notify layout
    window.dispatchEvent(new Event('moodChanged'));
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay} className="animate-pop">
      <div style={styles.card} className="card">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.heartIcon}>
            <Heart size={28} fill="#20BEE8" color="#323244" />
          </div>
          <h1 style={styles.title}>Welcome to TeenHelpline</h1>
          <p style={styles.tagline}>"The Safest Place for Teenagers to Heal."</p>
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <h2 style={styles.question}>How are you feeling today?</h2>
          <p style={styles.subtitle}>Select a mood so we can customize your safe space.</p>
        </div>

        {/* Options Grid */}
        <div style={styles.grid}>
          {MOOD_OPTIONS.map((opt) => (
            <button
              key={opt.mood}
              onClick={() => handleSelect(opt.mood)}
              style={{
                ...styles.moodBtn,
                backgroundColor: opt.color,
                color: opt.textColor,
                border: `1px solid ${opt.textColor === '#323244' && opt.color === '#FAF9F6' ? '#FFC0C1' : 'transparent'}`
              }}
              className="card-hover"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={styles.emoji}>{opt.emoji}</span>
              <div style={styles.textContainer}>
                <span style={styles.moodLabel}>{opt.mood}</span>
                <span style={styles.moodDesc}>{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Safety Note */}
        <div style={styles.footerNote}>
          <Sparkles size={14} color="#20BEE8" style={{ marginRight: '6px' }} />
          <span>Your response is 100% anonymous and never shared.</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 249, 246, 0.98)', // off-white with high opacity
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    overflowY: 'auto'
  },
  card: {
    backgroundColor: '#FAF9F6',
    maxWidth: '750px',
    width: '100%',
    padding: '3rem 2.5rem',
    borderRadius: '32px',
    textAlign: 'center',
    border: '1px solid #FFC0C1',
    boxShadow: '0 20px 50px rgba(50, 50, 68, 0.08)',
    margin: 'auto'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  heartIcon: {
    width: '54px',
    height: '54px',
    borderRadius: '18px',
    backgroundColor: '#FFC0C1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #20BEE8',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#323244',
    letterSpacing: '-0.5px',
    marginBottom: '0.2rem'
  },
  tagline: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#20BEE8'
  },
  questionSection: {
    marginBottom: '2rem'
  },
  question: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#323244',
    marginBottom: '0.4rem'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#323244',
    opacity: 0.85
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.2rem',
    marginBottom: '2.5rem'
  },
  moodBtn: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    padding: '1rem 1.5rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    gap: '1rem',
    width: '100%'
  },
  emoji: {
    fontSize: '2.2rem',
    flexShrink: 0
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  moodLabel: {
    fontSize: '1.15rem',
    fontWeight: 700,
    lineHeight: '1.2'
  },
  moodDesc: {
    fontSize: '0.85rem',
    fontWeight: 400,
    opacity: 0.85
  },
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    color: '#323244',
    opacity: 0.8
  }
};
