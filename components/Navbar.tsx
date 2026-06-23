'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Compass, MessageCircle, BookOpen, Award, LayoutGrid } from 'lucide-react';
import { dbService } from '../lib/supabase';
import { Profile } from '../lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Load profile
    const loadProfile = async () => {
      const storedLogin = localStorage.getItem('th_logged_in') === 'true';
      setIsLoggedIn(storedLogin);
      const userProfile = await dbService.getProfile(storedLogin ? 'user123' : 'guest');
      setProfile(userProfile);
    };

    loadProfile();

    const handleStorageChange = () => {
      loadProfile();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, [pathname]);

  // Hide Navbar completely on the Dashboard sub-website
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.open('/auth', '_blank');
    } else {
      window.open('/dashboard', '_blank');
    }
  };

  const navLinks = [
    { name: 'Calm Zone', href: '/calm-zone', icon: Compass },
    { name: 'Community', href: '/community', icon: MessageCircle },
    { name: 'Resources', href: '/resources', icon: BookOpen }
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container} className="container">
        {/* Logo */}
        <Link href="/" style={styles.logo}>
          <img src="/logo_icon.png" alt="TeenHelpline Logo" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
          <div>
            <span style={styles.logoText}>TeenHelpline</span>
            <span style={styles.logoTag}>India</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu} className="nav-desktop-menu">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                style={{
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {})
                }}
              >
                <Icon size={18} style={styles.icon} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Dashboard CTA */}
        <div style={styles.authContainer} className="nav-auth-container">
          {profile && (
            <div style={styles.pointsBadge}>
              <Award size={16} color="#323244" style={{ marginRight: '4px' }} />
              <span>{profile.points} Points</span>
            </div>
          )}

          <button onClick={handleDashboardClick} style={styles.buddyBtn} className="btn btn-primary">
            <LayoutGrid size={16} />
            <span style={styles.btnText}>Dashboard</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          style={styles.hamburger}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <div style={{...styles.line, ...(mobileOpen ? styles.line1Open : {})}}></div>
          <div style={{...styles.line, ...(mobileOpen ? styles.line2Open : {})}}></div>
          <div style={{...styles.line, ...(mobileOpen ? styles.line3Open : {})}}></div>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={styles.mobileDrawer}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileOpen(false)}
                style={{
                  ...styles.mobileLink,
                  ...(isActive ? styles.mobileActiveLink : {})
                }}
              >
                <Icon size={20} style={styles.icon} />
                {link.name}
              </Link>
            );
          })}
          <div style={styles.mobileAuth}>
            {profile && (
              <div style={{...styles.pointsBadge, marginBottom: '1.5rem', width: 'fit-content'}}>
                <Award size={16} color="#323244" style={{ marginRight: '4px' }} />
                <span>{profile.points} Points</span>
              </div>
            )}
            <button 
              onClick={(e) => {
                setMobileOpen(false);
                handleDashboardClick(e);
              }} 
              style={{ ...styles.buddyBtn, width: '100%' }}
              className="btn btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: '#FAF9F6',
    borderBottom: '1px solid #FFC0C1',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    height: '75px',
    display: 'flex',
    alignItems: 'center'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer'
  },
  logoText: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#323244',
    letterSpacing: '-0.5px',
    display: 'block',
    lineHeight: 1
  },
  logoTag: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#20BEE8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    lineHeight: 1
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#323244',
    padding: '0.5rem 0.8rem',
    borderRadius: '12px',
    transition: 'all 0.2s ease'
  },
  activeLink: {
    color: '#20BEE8',
    backgroundColor: '#FFC0C1',
    fontWeight: 600
  },
  icon: {
    flexShrink: 0
  },
  authContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  pointsBadge: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFC0C1',
    color: '#323244',
    border: '1px solid #20BEE8',
    padding: '0.4rem 0.8rem',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: 600
  },
  buddyBtn: {
    backgroundColor: '#20BEE8',
    color: '#323244',
    padding: '0.5rem 1.2rem',
    borderRadius: '50px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnText: {
    fontWeight: 600
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    zIndex: 101
  },
  line: {
    width: '100%',
    height: '2.5px',
    backgroundColor: '#323244',
    borderRadius: '2px',
    transition: 'all 0.3s ease'
  },
  line1Open: {
    transform: 'translateY(8px) rotate(45deg)'
  },
  line2Open: {
    opacity: 0
  },
  line3Open: {
    transform: 'translateY(-8px) rotate(-45deg)'
  },
  mobileDrawer: {
    position: 'absolute',
    top: '75px',
    left: 0,
    right: 0,
    backgroundColor: '#FAF9F6',
    borderBottom: '1px solid #FFC0C1',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 10px 25px rgba(50, 50, 68, 0.08)'
  },
  mobileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontSize: '1.1rem',
    color: '#323244',
    padding: '0.8rem 1rem',
    borderRadius: '16px',
    fontWeight: 500
  },
  mobileActiveLink: {
    color: '#20BEE8',
    backgroundColor: '#FFC0C1',
    fontWeight: 600
  },
  mobileAuth: {
    marginTop: '1.5rem',
    borderTop: '1px solid #FFC0C1',
    paddingTop: '1.5rem'
  }
};
