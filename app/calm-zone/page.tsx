'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Compass, Wind, Anchor, Sparkles, Heart, Activity, Moon, BookOpen, Play, Pause, Volume2, VolumeX, Plus, Trash } from 'lucide-react';
import { dbService } from '../../lib/supabase';

// Audio Synthesizer utility using Web Audio API
class CalmAudioSynth {
  private ctx: AudioContext | null = null;
  
  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  playPop() {
    this.initCtx();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playBreatheTone(isInhale: boolean) {
    this.initCtx();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    const startFreq = isInhale ? 220 : 330;
    const endFreq = isInhale ? 330 : 220;
    
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(endFreq, this.ctx.currentTime + 4.0);
    
    gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4.0);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 4.0);
  }

  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  startSleepNoise(volume: number) {
    this.initCtx();
    if (!this.ctx) return;
    
    this.stopSleepNoise();
    
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
    
    noiseNode.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    noiseNode.start();
    
    this.rainSource = noiseNode;
    this.rainGain = gainNode;
  }

  updateVolume(volume: number) {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
    }
  }

  stopSleepNoise() {
    if (this.rainSource) {
      try {
        this.rainSource.stop();
      } catch (e) {}
      this.rainSource.disconnect();
      this.rainSource = null;
    }
    if (this.rainGain) {
      this.rainGain.disconnect();
      this.rainGain = null;
    }
  }
}

const audioSynth = new CalmAudioSynth();

export default function CalmZone() {
  const [activeTab, setActiveTab] = useState<string>('breathing');

  return (
    <div style={styles.page}>
      <div className="container section-padding">
        {/* Title */}
        <div style={styles.header}>
          <div style={styles.compassIcon}>
            <Compass size={28} color="var(--primary-teal)" />
          </div>
          <h1 style={styles.title}>The Calm Zone</h1>
          <p style={styles.subtitle}>
            A safe space of gamified interactive exercises to release stress, anxiety, and find emotional balance.
          </p>
        </div>

        {/* Layout: Sidebar + Active Zone */}
        <div style={styles.layout} className="calm-zone-layout">
          {/* Tabs Sidebar */}
          <div style={styles.sidebar}>
            {[
              { id: 'breathing', label: 'Breathing Orbit', emoji: '🌬️', desc: 'Guided circular breathing' },
              { id: 'bubbles', label: 'Bubble Burst', emoji: '🫧', desc: 'Tap and pop stress away' },
              { id: 'pet', label: 'Mood Pet Care', emoji: '🐱', desc: 'Watch your little companion grow' },
              { id: 'catch', label: 'Catch the Positivity', emoji: '🍎', desc: 'Catch falling happy thoughts!' },
              { id: 'sleep', label: 'Sleep Soundscape', emoji: '🌌', desc: 'Ambient sounds & starry sky' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  audioSynth.stopSleepNoise();
                  setActiveTab(tab.id);
                }}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === tab.id ? styles.tabBtnActive : {})
                }}
              >
                <span style={styles.tabEmoji}>{tab.emoji}</span>
                <div style={styles.tabText}>
                  <span style={styles.tabLabel}>{tab.label}</span>
                  <span style={styles.tabDesc}>{tab.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Game Window container */}
          <div style={styles.gameWindow} className="card">
            {activeTab === 'breathing' && <BreathingOrbitGame />}
            {activeTab === 'bubbles' && <BubbleBurstGame />}
            {activeTab === 'pet' && <MoodPetGame />}
            {activeTab === 'catch' && <CatchPositivityGame />}
            {activeTab === 'sleep' && <SleepJourneyGame />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. BREATHING ORBIT GAME
// ----------------------------------------------------
const BreathingOrbitGame = () => {
  const [breatheState, setBreatheState] = useState<'In' | 'Hold' | 'Out' | 'Ready'>('Ready');
  const [timeLeft, setTimeLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setBreatheState((curr) => {
            if (curr === 'Ready' || curr === 'Out') {
              audioSynth.playBreatheTone(true);
              setTimeLeft(4);
              return 'In';
            }
            if (curr === 'In') {
              setTimeLeft(4);
              return 'Hold';
            }
            if (curr === 'Hold') {
              audioSynth.playBreatheTone(false);
              setTimeLeft(4);
              setCompletedCycles((c) => {
                const next = c + 1;
                if (next % 3 === 0) {
                  dbService.addPoints(5, 'user123');
                  window.dispatchEvent(new Event('profileUpdated'));
                }
                return next;
              });
              return 'Out';
            }
            return 'In';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const toggleBreathe = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
      setBreatheState('Ready');
      setTimeLeft(4);
    } else {
      setIsPlaying(true);
      setBreatheState('In');
      audioSynth.playBreatheTone(true);
      setTimeLeft(4);
    }
  };

  const getCircleScale = () => {
    if (breatheState === 'In') return 1.4;
    if (breatheState === 'Hold') return 1.4;
    if (breatheState === 'Out') return 0.85;
    return 1.0;
  };

  return (
    <div style={styles.gameInner}>
      <h2 style={styles.gameTitle}>🌬️ Breathing Orbit</h2>
      <p style={styles.gameDescription}>
        Soften your thoughts and slow down. Inhale as the circle expands, hold your breath at its peak, and exhale slowly as it contracts.
      </p>

      {/* Illustrative image of children/teens relaxing */}
      <div style={styles.illustrationGameHeader}>
        <img src="/media__1782194988151.png" alt="Relaxing Kids" style={styles.gameIllustativeImage} />
        <span style={styles.illustrationQuote}>"Breathe slowly, dost. Calm is your superpower! 🌸"</span>
      </div>

      <div style={styles.breathingContainer}>
        <div 
          style={{
            ...styles.breathingCircle,
            transform: `scale(${getCircleScale()})`,
            backgroundColor: breatheState === 'In' ? '#F0F3FC' : breatheState === 'Hold' ? '#EBF2FA' : '#FFFFFF',
            borderColor: breatheState === 'In' ? 'var(--primary-teal)' : breatheState === 'Hold' ? 'var(--primary-teal-light)' : 'var(--border-color)'
          }}
        >
          <div style={styles.breathingText}>
            {breatheState === 'Ready' ? 'Breathe' : breatheState}
            {breatheState !== 'Ready' && <span style={styles.breathingTimer}>{timeLeft}s</span>}
          </div>
        </div>
      </div>

      <div style={styles.breathingStats}>
        <span>Completed Cycles: <strong>{completedCycles}</strong></span>
        {completedCycles > 0 && completedCycles % 3 === 0 && (
          <span style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>🌟 +5 Points Awarded!</span>
        )}
      </div>

      <button onClick={toggleBreathe} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        {isPlaying ? 'Pause Exercise' : 'Start Guided Breath'}
      </button>
    </div>
  );
};

// ----------------------------------------------------
// 2. BUBBLE BURST GAME
// ----------------------------------------------------
interface BubbleObj {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

const BubbleBurstGame = () => {
  const [bubbles, setBubbles] = useState<BubbleObj[]>([]);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<any>(null);

  useEffect(() => {
    const initial: BubbleObj[] = Array.from({ length: 8 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 85 + 5,
      y: Math.random() * 80 + 100,
      size: Math.random() * 30 + 30,
      speed: Math.random() * 0.8 + 0.4,
      color: ['#F2F0FF', '#F6F4FF', '#EBF2FA', '#F0FFF4', '#FFFBEB'][Math.floor(Math.random() * 5)]
    }));
    setBubbles(initial);

    gameLoopRef.current = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          let newY = b.y - b.speed;
          if (newY < -50) {
            newY = 320;
            return {
              ...b,
              y: newY,
              x: Math.random() * 85 + 5,
              speed: Math.random() * 0.8 + 0.4
            };
          }
          return { ...b, y: newY };
        })
      );
    }, 30);

    return () => clearInterval(gameLoopRef.current);
  }, []);

  const popBubble = (id: number) => {
    audioSynth.playPop();
    setScore((s) => {
      const next = s + 1;
      if (next % 10 === 0) {
        dbService.addPoints(4, 'user123');
        window.dispatchEvent(new Event('profileUpdated'));
      }
      return next;
    });

    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            y: 320,
            x: Math.random() * 85 + 5,
            speed: Math.random() * 0.8 + 0.4
          };
        }
        return b;
      })
    );
  };

  return (
    <div style={styles.gameInner}>
      <h2 style={styles.gameTitle}>🫧 Bubble Burst</h2>
      <p style={styles.gameDescription}>
        Satisfying bubble popping exercise. Click or tap rising bubbles to burst stress away.
      </p>

      {/* Illustrative image of children playing with bubbles */}
      <div style={styles.illustrationGameHeader}>
        <img src="/media__1782194827509.png" alt="Kids playing" style={styles.gameIllustativeImage} />
        <span style={styles.illustrationQuote}>"Pop! Release all the stress and look for the surprises! 🎁"</span>
      </div>

      <div style={styles.bubbleGameArea}>
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => popBubble(b.id)}
            style={{
              ...styles.bubbleBtn,
              left: `${b.x}%`,
              top: `${b.y}px`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              backgroundColor: b.color,
              border: '2px solid var(--accent-sage-light)'
            }}
          />
        ))}
      </div>

      <div style={styles.breathingStats}>
        <span>Bubbles Popped: <strong>{score}</strong></span>
        {score > 0 && score % 10 === 0 && (
          <span style={{ color: 'var(--primary-teal)', fontWeight: 600 }}>🌟 +4 Points Awarded!</span>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. MOOD PET CARE GAME
// ----------------------------------------------------
const MoodPetGame = () => {
  const [petMood, setPetMood] = useState('Cheerful');
  const [happiness, setHappiness] = useState(80);
  const [energy, setEnergy] = useState(70);
  const [foodValue, setFoodValue] = useState('');

  useEffect(() => {
    const decay = setInterval(() => {
      setHappiness((h) => Math.max(10, h - 2));
      setEnergy((e) => Math.max(10, e - 1));
    }, 5000);
    return () => clearInterval(decay);
  }, []);

  useEffect(() => {
    const val = (happiness + energy) / 2;
    if (val > 80) setPetMood('Cheerful 😊');
    else if (val > 50) setPetMood('Content 😌');
    else if (val > 25) setPetMood('Tired 💤');
    else setPetMood('Lonely 😢');
  }, [happiness, energy]);

  const handleFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodValue.trim()) return;

    setHappiness((h) => Math.min(100, h + 12));
    setEnergy((e) => Math.min(100, e + 8));
    setFoodValue('');
    audioSynth.playPop();

    dbService.addPoints(2, 'user123');
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handlePlay = () => {
    setHappiness((h) => Math.min(100, h + 20));
    setEnergy((e) => Math.max(10, e - 12));
    audioSynth.playPop();

    dbService.addPoints(2, 'user123');
    window.dispatchEvent(new Event('profileUpdated'));
  };

  return (
    <div style={styles.gameInner}>
      <h2 style={styles.gameTitle}>🐱 Mood Pet Care</h2>
      <p style={styles.gameDescription}>
        Nurture your little virtual companion cat. Feed them, play with them, and watch them glow!
      </p>

      {/* Illustrative image of caring child */}
      <div style={styles.illustrationGameHeader}>
        <img src="/media__1782218276474.png" alt="Caring Child" style={styles.gameIllustativeImage} />
        <span style={styles.illustrationQuote}>"Nurturing a companion teaches us to care for ourselves! ❤️"</span>
      </div>

      <div className="card" style={{ width: '100%', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
        <div style={styles.petContainer}>
          <div style={styles.petAvatar}>
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" fill="#F0F3FC" stroke="var(--primary-teal)" strokeWidth="3" />
              {/* Cat ears */}
              <path d="M22 25 L35 40 L18 42 Z" fill="var(--primary-teal-light)" />
              <path d="M78 25 L65 40 L82 42 Z" fill="var(--primary-teal-light)" />
              {/* Eyes */}
              <circle cx="35" cy="48" r="4" fill="var(--text-dark)" />
              <circle cx="65" cy="48" r="4" fill="var(--text-dark)" />
              {/* Whiskers */}
              <line x1="20" y1="55" x2="10" y2="52" stroke="var(--text-muted)" strokeWidth="2" />
              <line x1="20" y1="60" x2="8" y2="60" stroke="var(--text-muted)" strokeWidth="2" />
              <line x1="80" y1="55" x2="90" y2="52" stroke="var(--text-muted)" strokeWidth="2" />
              <line x1="80" y1="60" x2="92" y2="60" stroke="var(--text-muted)" strokeWidth="2" />
              {/* Blushing cheeks */}
              <circle cx="28" cy="55" r="5" fill="#FEB2B2" opacity="0.6" />
              <circle cx="72" cy="55" r="5" fill="#FEB2B2" opacity="0.6" />
              {/* Smiling mouth */}
              {petMood.includes('Lonely') ? (
                <path d="M45 68 C48 64 52 64 55 68" stroke="var(--text-dark)" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <path d="M45 62 C48 65 52 65 55 62" stroke="var(--text-dark)" strokeWidth="3" strokeLinecap="round" />
              )}
            </svg>
          </div>

          <div style={styles.petMetrics}>
            <div style={styles.petMetricRow}>
              <span>Companion Vibe:</span>
              <span style={{ color: 'var(--primary-teal)', fontWeight: 700 }}>{petMood}</span>
            </div>
            
            <div style={styles.petMetricRow}>
              <span>Happiness:</span>
              <div style={styles.barContainer}>
                <div style={{ ...styles.barFill, width: `${happiness}%`, backgroundColor: 'var(--primary-teal)' }} />
              </div>
            </div>

            <div style={styles.petMetricRow}>
              <span>Energy level:</span>
              <div style={styles.barContainer}>
                <div style={{ ...styles.barFill, width: `${energy}%`, backgroundColor: 'var(--accent-sage)' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.petActions}>
          <button onClick={handlePlay} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>
            🎾 Play with Pet (+2 pts)
          </button>
          
          <form onSubmit={handleFeed} style={styles.petFeedInput}>
            <input 
              type="text" 
              value={foodValue}
              onChange={(e) => setFoodValue(e.target.value)}
              placeholder="Type food, e.g. 'Milk', 'Cat treat'..."
              style={{ fontSize: '0.88rem' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem', borderRadius: '16px' }}>
              Feed
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. CATCH THE POSITIVITY GAME (NEW FUN GAME)
// ----------------------------------------------------
const CatchPositivityGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50); // percentage 0-100
  const [items, setItems] = useState<{ id: number; x: number; y: number; text: string; isGood: boolean; emoji: string }[]>([]);
  const gameLoopRef = useRef<any>(null);

  const startNewGame = () => {
    setScore(0);
    setItems([]);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const spawnTimer = setInterval(() => {
      setItems((prev) => {
        if (prev.length > 5) return prev;
        const list = [
          { emoji: '🌟', text: 'Hope', isGood: true },
          { emoji: '😊', text: 'Joy', isGood: true },
          { emoji: '🧘', text: 'Calm', isGood: true },
          { emoji: '🤝', text: 'Friend', isGood: true },
          { emoji: '💖', text: 'Love', isGood: true },
          { emoji: '⚡', text: 'Stress', isGood: false },
          { emoji: '😭', text: 'Anxiety', isGood: false }
        ];
        const pick = list[Math.floor(Math.random() * list.length)];
        return [
          ...prev,
          {
            id: Math.random(),
            x: Math.random() * 90 + 5,
            y: 0,
            emoji: pick.emoji,
            text: pick.text,
            isGood: pick.isGood
          }
        ];
      });
    }, 1200);

    gameLoopRef.current = setInterval(() => {
      setItems((prev) => {
        const next = prev.map((item) => ({ ...item, y: item.y + 3 }));
        
        return next.filter((item) => {
          if (item.y > 275) {
            const caught = Math.abs(item.x - basketX) < 12;
            if (caught) {
              if (item.isGood) {
                setScore((s) => {
                  const nextS = s + 10;
                  if (nextS % 50 === 0) {
                    dbService.addPoints(5, 'user123');
                    window.dispatchEvent(new Event('profileUpdated'));
                  }
                  return nextS;
                });
                audioSynth.playPop();
              } else {
                setScore((s) => Math.max(0, s - 15));
              }
              return false;
            }
            return false;
          }
          return true;
        });
      });
    }, 30);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, basketX]);

  return (
    <div style={styles.gameInner}>
      <h2 style={styles.gameTitle}>🍎 Catch the Positivity</h2>
      <p style={styles.gameDescription}>
        Move your basket left and right to catch positive items like Joy and Hope, while avoiding Stress and Anxiety!
      </p>

      {/* Illustrative image of children playing */}
      <div style={styles.illustrationGameHeader}>
        <img src="/media__1782225726481.png" alt="Happy Teenager Playing" style={styles.gameIllustativeImage} />
        <span style={styles.illustrationQuote}>"Catch the positive vibes today! 🌟"</span>
      </div>

      <div style={styles.catchGameArea}>
        {isPlaying ? (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${item.x}%`,
                  top: `${item.y}px`,
                  transform: 'translateX(-50%)',
                  fontSize: '1.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              >
                <span>{item.emoji}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.85)', padding: '1px 4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>{item.text}</span>
              </div>
            ))}
            
            {/* Basket */}
            <div
              style={{
                position: 'absolute',
                left: `${basketX}%`,
                bottom: '10px',
                transform: 'translateX(-50%)',
                fontSize: '2.5rem',
                transition: 'left 0.1s ease',
                pointerEvents: 'none'
              }}
            >
              🧺
            </div>
          </>
        ) : (
          <div style={styles.gameStartScreen}>
            <span style={{ fontSize: '3rem' }}>🎮</span>
            <h3>Ready to Catch Positivity?</h3>
            <button onClick={startNewGame} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Start Playing
            </button>
          </div>
        )}
      </div>

      {isPlaying && (
        <div style={{ width: '100%' }}>
          <div style={styles.catchScoreBoard}>
            <span>Score: <strong style={{ fontSize: '1.2rem', color: 'var(--primary-teal)' }}>{score} points</strong></span>
            <span>Target: <strong>100 points</strong></span>
          </div>

          <div style={styles.controlButtonsRow}>
            <button 
              onMouseDown={() => setBasketX((x) => Math.max(8, x - 10))} 
              className="btn btn-secondary"
              style={{ flexGrow: 1 }}
            >
              ◀ Move Left
            </button>
            <button 
              onMouseDown={() => setBasketX((x) => Math.min(92, x + 10))} 
              className="btn btn-secondary"
              style={{ flexGrow: 1 }}
            >
              Move Right ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 5. SLEEP JOURNEY GAME
// ----------------------------------------------------
const SleepJourneyGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    return () => {
      audioSynth.stopSleepNoise();
    };
  }, []);

  const toggleSound = () => {
    if (isPlaying) {
      audioSynth.stopSleepNoise();
      setIsPlaying(false);
    } else {
      audioSynth.startSleepNoise(volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (isPlaying) {
      audioSynth.updateVolume(val);
    }
  };

  return (
    <div style={styles.gameInner}>
      <h2 style={styles.gameTitle}>🌌 Sleep Soundscape</h2>
      <p style={styles.gameDescription}>
        Ambient soft rain soundscape loop to ease your eyes. Turn it on, set the volume, and rest peacefully.
      </p>

      {/* Illustrative image of calm child listening to soundscapes */}
      <div style={styles.illustrationGameHeader}>
        <img src="/media__1782194988151.png" alt="Calm Sleep" style={styles.gameIllustativeImage} />
        <span style={styles.illustrationQuote}>"Rest your mind. You did amazing today. 💤"</span>
      </div>

      <div style={styles.starryContainer}>
        {/* Stylized Moon */}
        <div style={styles.moonSVG}>
          <svg width="60" height="60" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="#FFFDEB" />
            <circle cx="38" cy="42" r="30" fill="#1A202C" />
          </svg>
        </div>

        {/* Shimmering stars */}
        <div style={styles.starsGroup}>
          <span style={{ ...styles.star, left: '20%', top: '25%' }}>⭐</span>
          <span style={{ ...styles.star, left: '75%', top: '30%' }}>⭐</span>
          <span style={{ ...styles.star, left: '45%', top: '15%' }}>✨</span>
          <span style={{ ...styles.star, left: '15%', top: '70%' }}>✨</span>
          <span style={{ ...styles.star, left: '80%', top: '75%' }}>⭐</span>
        </div>
      </div>

      <div style={styles.sleepControls}>
        <button onClick={toggleSound} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
          {isPlaying ? 'Stop Rain Sounds' : 'Start Rain Sounds'}
        </button>

        <div style={styles.volumeContainer}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Volume Control</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume} 
            onChange={handleVolumeChange} 
            style={styles.rangeInput}
          />
        </div>
      </div>
    </div>
  );
};

// CSS properties
const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: 'var(--bg-cream)',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  compassIcon: {
    width: '54px',
    height: '54px',
    borderRadius: '18px',
    backgroundColor: 'var(--bg-soft-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text-dark)',
    letterSpacing: '-1.2px',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '700px',
    lineHeight: 1.5
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.25s ease'
  },
  tabBtnActive: {
    backgroundColor: 'var(--primary-teal-light)',
    borderColor: 'var(--primary-teal)',
    boxShadow: '0 4px 15px rgba(118, 115, 224, 0.12)',
    transform: 'scale(1.02)'
  },
  tabEmoji: {
    fontSize: '1.8rem',
    lineHeight: 1
  },
  tabText: {
    display: 'flex',
    flexDirection: 'column'
  },
  tabLabel: {
    fontSize: '0.98rem',
    fontWeight: 700,
    color: 'var(--text-dark)'
  },
  tabDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  gameWindow: {
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    padding: '3rem 2rem',
    minHeight: '480px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid var(--border-color)'
  },
  gameInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '550px'
  },
  gameTitle: {
    fontSize: '1.8rem',
    color: 'var(--text-dark)',
    marginBottom: '0.5rem',
    fontWeight: 800
  },
  gameDescription: {
    fontSize: '0.92rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
    lineHeight: 1.5
  },
  illustrationGameHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'var(--bg-sand)',
    padding: '0.8rem 1.2rem',
    borderRadius: '16px',
    marginBottom: '1.5rem',
    width: '100%',
    justifyContent: 'center',
    border: '1px solid var(--border-color)'
  },
  gameIllustativeImage: {
    height: '60px',
    width: '60px',
    objectFit: 'contain'
  },
  illustrationQuote: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--primary-teal)',
    fontStyle: 'italic'
  },
  breathingContainer: {
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.8rem',
    width: '100%'
  },
  breathingCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    borderWidth: '3px',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1), background-color 4s, border-color 4s'
  },
  breathingText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-dark)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  breathingTimer: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-muted)'
  },
  breathingStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  bubbleGameArea: {
    position: 'relative',
    width: '100%',
    height: '300px',
    backgroundColor: '#ffffff',
    border: '1.5px solid var(--border-color)',
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '1.5rem'
  },
  bubbleBtn: {
    position: 'absolute',
    borderRadius: '50%',
    cursor: 'pointer',
    outline: 'none',
    opacity: 0.85,
    boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.02)',
    transition: 'transform 0.1s'
  },
  petContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    marginBottom: '1.5rem'
  },
  petAvatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px'
  },
  petMetrics: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  petMetricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: 'var(--text-dark)'
  },
  barContainer: {
    width: '65%',
    height: '10px',
    backgroundColor: '#E2E8F0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.3s'
  },
  petActions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  petFeedInput: {
    display: 'flex',
    gap: '0.5rem'
  },
  catchGameArea: {
    position: 'relative',
    width: '100%',
    height: '320px',
    backgroundColor: '#FFFFFF',
    border: '1.5px solid var(--border-color)',
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '1.5rem'
  },
  gameStartScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '0.5rem'
  },
  catchScoreBoard: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.92rem',
    fontWeight: 600,
    marginBottom: '1rem',
    borderBottom: '1.5px solid var(--border-soft)',
    paddingBottom: '0.5rem'
  },
  controlButtonsRow: {
    display: 'flex',
    gap: '0.8rem',
    width: '100%'
  },
  starryContainer: {
    width: '100%',
    height: '180px',
    backgroundColor: '#1E1D3B',
    borderRadius: '20px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moonSVG: {
    zIndex: 2
  },
  starsGroup: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  star: {
    position: 'absolute',
    fontSize: '0.8rem',
    opacity: 0.65
  },
  sleepControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%'
  },
  volumeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    gap: '0.5rem'
  },
  rangeInput: {
    width: '100%',
    accentColor: 'var(--primary-teal)',
    cursor: 'pointer'
  }
};
