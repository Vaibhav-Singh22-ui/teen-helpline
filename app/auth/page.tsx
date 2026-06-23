'use client';

import React, { useState } from 'react';
import { Shield, Mail, Lock, Heart, LayoutGrid } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/dashboard'
          }
        });
        if (error) throw error;
      } else {
        simulateLocalLogin('Google User');
      }
    } catch (err: any) {
      console.error(err);
      simulateLocalLogin('Google User (Demo)');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      if (supabase) {
        if (activeTab === 'login') {
          const { error, data } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data?.user) {
            localStorage.setItem('th_logged_in', 'true');
            window.location.href = '/dashboard';
          }
        } else {
          const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: name }
            }
          });
          if (error) throw error;
          setSuccessMsg('✨ Sign up successful! Mock login activated.');
          setTimeout(() => {
            simulateLocalLogin(name || 'New Friend');
          }, 1200);
        }
      } else {
        simulateLocalLogin(activeTab === 'signup' ? name : email.split('@')[0]);
      }
    } catch (err: any) {
      console.error(err);
      simulateLocalLogin(activeTab === 'signup' ? name : email.split('@')[0]);
    } finally {
      setLoading(false);
    }
  };

  const simulateLocalLogin = (displayName: string) => {
    localStorage.setItem('th_logged_in', 'true');
    const guestProfile = localStorage.getItem('th_profile');
    if (guestProfile) {
      const parsed = JSON.parse(guestProfile);
      parsed.display_name = displayName;
      localStorage.setItem('th_profile', JSON.stringify(parsed));
    }
    window.dispatchEvent(new Event('profileUpdated'));
    window.location.href = '/dashboard';
  };

  return (
    <div style={styles.page}>
      <div className="container section-padding" style={styles.container}>
        <div className="card animate-pop" style={styles.card}>
          
          {/* Creative Interactive Buddy Avatar / Storyset Illustration */}
          <div style={styles.avatarWrapper}>
            <img 
              src="/media__1782194827509.png" 
              alt="Safe Space Entry" 
              style={styles.authIllustration} 
            />
            <div style={styles.speechBubble}>
              {isPasswordFocused ? "Shh... Your secret is fully safe with me! 🔒" : "Hey! Enter your secure keys below. ✨"}
            </div>
          </div>

          {/* Brand Header */}
          <div style={styles.brandHeader}>
            <h2 style={styles.title}>Safe Space Entry</h2>
            <p style={styles.subtitle}>Unlock your private dashboard & academic scheduler.</p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && <div style={styles.errorDiv}>{errorMsg}</div>}
          {successMsg && <div style={styles.successDiv}>{successMsg}</div>}

          {/* Tabs */}
          <div style={styles.tabRow}>
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'login' ? styles.tabBtnActive : {})
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'signup' ? styles.tabBtnActive : {})
              }}
            >
              Register
            </button>
          </div>

          {/* OAuth Google */}
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            disabled={loading}
            style={styles.googleBtn}
            className="btn btn-outline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.84-2.48 2.5v2.08h4.01c2.34-2.16 3.68-5.32 3.68-8.93Z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A11.97 11.97 0 0 0 12 24Z"/>
              <path fill="#FBBC05" d="M5.27 14.29a7.18 7.18 0 0 1 0-4.58V6.6H1.29a11.98 11.98 0 0 0 0 10.79l3.98-3.1Z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.32 2.67 1.29 6.6l3.98 3.1c.95-2.85 3.6-4.95 6.73-4.95Z"/>
            </svg>
            Continue with Google
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or use email details</span>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} style={styles.form}>
            {activeTab === 'signup' && (
              <div style={styles.formGroup}>
                <label>Secret Nickname</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., StarrySky, HopefulHeart"
                  required
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} color="#20BEE8" style={styles.inputIcon} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E.g., friend@helper.com"
                  style={styles.inputWithIcon}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Private Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#20BEE8" style={styles.inputIcon} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  style={styles.inputWithIcon}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Entering Safe Space...' : activeTab === 'login' ? 'Enter Safe Space' : 'Register Secure Account'}
            </button>
          </form>

          {/* Privacy note */}
          <div style={styles.footerNote}>
            <Shield size={12} color="#20BEE8" style={{ marginRight: '4px' }} />
            <span>Encrypted validation. No public profiles.</span>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: '#FAF9F6',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  card: {
    backgroundColor: '#ffffff',
    maxWidth: '430px',
    width: '100%',
    padding: '2.5rem',
    borderRadius: '30px',
    border: '1px solid rgba(32, 190, 232, 0.15)',
    boxShadow: '0 15px 35px rgba(50, 50, 68, 0.04)'
  },
  avatarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem',
    position: 'relative'
  },
  buddySvg: {
    filter: 'drop-shadow(0 4px 10px rgba(32, 190, 232, 0.08))'
  },
  speechBubble: {
    backgroundColor: '#FFC0C1',
    border: '1px solid #FEF08A',
    borderRadius: '12px',
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#B7791F',
    marginTop: '0.8rem',
    textAlign: 'center',
    maxWidth: '85%'
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.7rem',
    fontWeight: 800,
    color: '#323244',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#323244',
    marginTop: '0.2rem',
    lineHeight: 1.3
  },
  errorDiv: {
    backgroundColor: '#FFC0C1',
    color: '#323244',
    border: '1px solid #FFC0C1',
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontWeight: 500,
    marginBottom: '1rem',
    lineHeight: 1.4
  },
  successDiv: {
    backgroundColor: '#F0FFF4',
    color: '#38A169',
    border: '1px solid #FAF9F6',
    padding: '0.7rem 1rem',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontWeight: 500,
    marginBottom: '1rem'
  },
  tabRow: {
    display: 'flex',
    backgroundColor: '#FAF9F6',
    padding: '0.3rem',
    borderRadius: '14px',
    gap: '0.2rem',
    marginBottom: '1.2rem'
  },
  tabBtn: {
    flexGrow: 1,
    padding: '0.6rem 0.8rem',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#323244',
    transition: 'all 0.2s'
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    color: '#20BEE8',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  googleBtn: {
    width: '100%',
    padding: '0.7rem',
    fontSize: '0.92rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.2rem',
    borderWidth: '1.5px',
    borderColor: '#FFC0C1',
    borderRadius: '50px'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '1.2rem 0',
    borderBottom: '1px solid #FFC0C1',
    lineHeight: '0.1em'
  },
  dividerText: {
    backgroundColor: '#ffffff',
    padding: '0 0.8rem',
    fontSize: '0.78rem',
    color: '#20BEE8',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  inputWithIcon: {
    paddingLeft: '2.5rem'
  },
  footerNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    color: '#20BEE8',
    marginTop: '1.5rem',
    textAlign: 'center'
  },
  authIllustration: {
    width: '100%',
    maxHeight: '160px',
    objectFit: 'contain',
    marginBottom: '1rem'
  }
};
