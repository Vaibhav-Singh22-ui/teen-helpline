'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShieldAlert, PhoneCall, Calendar, ExternalLink } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer style={styles.footer}>
      <div className="container">
        {/* Emergency Alert Banner */}
        <div style={styles.emergencyBanner}>
          <div style={styles.alertHeader}>
            <ShieldAlert size={24} color="#323244" style={{ flexShrink: 0 }} />
            <h3 style={styles.alertTitle}>Emergency Support & Crisis Resources</h3>
          </div>
          <p style={styles.alertText}>
            If you are in immediate danger, feeling suicidal, or experiencing a mental health crisis, please reach out to these free, anonymous 24/7 helplines in India. You do not have to go through this alone.
          </p>
          <div style={styles.helplineList}>
            <div style={styles.helplineCard}>
              <span style={styles.helplineName}>AASRA Suicide Helpline</span>
              <a href="tel:+919820466726" style={styles.helplinePhone}>
                <PhoneCall size={14} /> +91-9820466726
              </a>
            </div>
            <div style={styles.helplineCard}>
              <span style={styles.helplineName}>Vandrevala Foundation</span>
              <a href="tel:+919999666555" style={styles.helplinePhone}>
                <PhoneCall size={14} /> +91-9999666555
              </a>
            </div>
            <div style={styles.helplineCard}>
              <span style={styles.helplineName}>Kiran Mental Health (Govt)</span>
              <a href="tel:18005990019" style={styles.helplinePhone}>
                <PhoneCall size={14} /> 1800-599-0019
              </a>
            </div>
            <div style={styles.helplineCard}>
              <span style={styles.helplineName}>Child Helpline (Govt)</span>
              <a href="tel:1098" style={styles.helplinePhone}>
                <PhoneCall size={14} /> 1098
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div style={styles.grid} className="footer-grid-layout">
          <div style={styles.brandCol}>
            <Link href="/" style={styles.logo}>
              <img src="/logo_icon.png" alt="TeenHelpline Logo" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
              <span style={styles.logoText}>TeenHelpline</span>
            </Link>
            <p style={styles.brandDesc}>
              An AI-powered emotional wellness platform built specifically for teenagers. A safe, anonymous, and judgment-free space to heal, grow, and connect.
            </p>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Support Zones</h4>
            <ul style={styles.linkList}>
              <li><Link href="/calm-zone" style={styles.link}>Calm Zone (Mini-Games)</Link></li>
              <li><Link href="/community" style={styles.link}>Anonymous Community</Link></li>
              <li><Link href="/counselors" style={styles.link}>Talk to Counselors</Link></li>
              <li><Link href="/resources" style={styles.link}>Helpful Resources</Link></li>
            </ul>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Safety & Policies</h4>
            <ul style={styles.linkList}>
              <li><span style={styles.safetyItem}>🔒 Double-Encrypted Private Journal</span></li>
              <li><span style={styles.safetyItem}>🛡️ 24/7 AI-Moderated Community</span></li>
              <li><span style={styles.safetyItem}>⏳ Posts Auto-Expire After 7 Days</span></li>
              <li><span style={styles.safetyItem}>🚫 No Direct Messaging Allowed</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} TeenHelpline. Built for teenagers in India. The safest place to heal.
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#FAF9F6',
    borderTop: '1px solid #FFC0C1',
    padding: '4rem 0 2rem 0',
    marginTop: 'auto'
  },
  emergencyBanner: {
    backgroundColor: '#FFC0C1',
    border: '1.5px solid #323244',
    borderRadius: '24px',
    padding: '1.8rem',
    marginBottom: '3rem',
    boxShadow: '0 4px 15px rgba(50, 50, 68, 0.04)'
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '0.6rem'
  },
  alertTitle: {
    color: '#323244',
    fontSize: '1.2rem',
    fontWeight: 700
  },
  alertText: {
    color: '#323244',
    fontSize: '0.95rem',
    marginBottom: '1.2rem',
    lineHeight: '1.5',
    opacity: 0.9
  },
  helplineList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  helplineCard: {
    backgroundColor: '#FAF9F6',
    border: '1px solid #FFC0C1',
    borderRadius: '16px',
    padding: '0.8rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    boxShadow: '0 2px 6px rgba(50, 50, 68, 0.02)'
  },
  helplineName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#323244',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  helplinePhone: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#323244',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '3rem',
    marginBottom: '3rem'
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#323244'
  },
  brandDesc: {
    fontSize: '0.95rem',
    color: '#323244',
    lineHeight: '1.6',
    maxWidth: '380px',
    opacity: 0.85
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  colTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#323244',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    padding: 0
  },
  link: {
    fontSize: '0.95rem',
    color: '#323244',
    transition: 'color 0.2s',
    cursor: 'pointer',
    opacity: 0.95
  },
  safetyItem: {
    fontSize: '0.95rem',
    color: '#323244',
    opacity: 0.95
  },
  bottom: {
    borderTop: '1px solid #FFC0C1',
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'center'
  },
  copyright: {
    fontSize: '0.85rem',
    color: '#323244',
    textAlign: 'center',
    opacity: 0.8
  }
};
