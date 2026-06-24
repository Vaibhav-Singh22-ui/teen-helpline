'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Clock, Video, MessageSquare, PhoneCall, Calendar, X, AlertCircle } from 'lucide-react';
import { dbService } from '../../lib/supabase';
import { CounselorBooking } from '../../lib/types';

export default function Counselors() {
  const router = useRouter();
  const [counselors, setCounselors] = useState<any[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<any | null>(null);
  
  // Booking Form State
  const [bookingMode, setBookingMode] = useState<'instant' | 'scheduled'>('instant');
  const [sessionType, setSessionType] = useState<'text' | 'audio' | 'video'>('text');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('15:00');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dbService.initialize();
    setCounselors(dbService.getCounselorsList());
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const openBookingModal = (counselor: any) => {
    setSelectedCounselor(counselor);
    setSuccess(false);
  };

  const closeBookingModal = () => {
    setSelectedCounselor(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselor) return;

    setLoading(true);
    
    const appointmentTime = bookingMode === 'instant'
      ? new Date().toISOString()
      : new Date(`${bookingDate}T${bookingTime}:00`).toISOString();

    const bookingData: Omit<CounselorBooking, 'id'> = {
      user_id: 'guest',
      counselor_name: selectedCounselor.name,
      counselor_photo: selectedCounselor.photo,
      counselor_expertise: selectedCounselor.expertise,
      appointment_time: appointmentTime,
      status: 'scheduled',
      session_type: sessionType
    };

    try {
      const isLoggedIn = localStorage.getItem('th_logged_in') === 'true';
      await dbService.addBooking(bookingData, isLoggedIn ? 'user123' : 'guest');
      
      // Award points for seeking help
      await dbService.addPoints(10, isLoggedIn ? 'user123' : 'guest');
      window.dispatchEvent(new Event('profileUpdated'));

      setSuccess(true);
      setTimeout(() => {
        closeBookingModal();
        // Redirect to dashboard to see active booking card in a new tab
        window.open(process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001', '_blank');
      }, 1500);
    } catch (err) {
      alert('Error booking session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="container section-padding">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <Shield size={28} color="#20BEE8" />
          </div>
          <h1 style={styles.title}>Professional & Peer Support</h1>
          <p style={styles.subtitle}>
            Book free, anonymous support sessions. Speak with verified child psychologists, friendly student mentors, or volunteers who understand what you're going through.
          </p>
        </div>

        {/* Safety Disclaimer */}
        <div style={styles.disclaimerCard} className="card">
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
            <AlertCircle size={22} color="#20BEE8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1rem', color: '#323244', fontWeight: 700, marginBottom: '0.2rem' }}>Safe Space Counseling Policy</h3>
              <p style={{ fontSize: '0.88rem', color: '#323244', lineHeight: 1.4 }}>
                All counseling is completely confidential. You do not need to show your face or use your real name. Sessions can be text-only, audio, or video, depending on your comfort level.
              </p>
            </div>
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="grid-3">
          {counselors.map((c) => (
            <div key={c.id} className="card card-hover" style={styles.counselorCard}>
              <div style={styles.imageWrapper}>
                <img src={c.photo} alt={c.name} style={styles.photo} />
                <span style={styles.verifyBadge}>
                  <CheckCircle size={12} fill="#FAF9F6" /> Verified Support
                </span>
              </div>
              
              <h3 style={styles.counselorName}>{c.name}</h3>
              <span style={styles.expertiseText}>{c.expertise}</span>
              
              <div style={styles.statsContainer}>
                <div style={styles.statRow}>
                  <span>💼 Experience:</span>
                  <strong>{c.experience}</strong>
                </div>
                <div style={styles.statRow}>
                  <span>📅 Availability:</span>
                  <span style={styles.availText}>{c.availability}</span>
                </div>
              </div>

              <button 
                onClick={() => openBookingModal(c)} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Book Free Support
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCounselor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="card animate-pop">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Book Counseling Session</h2>
              <button onClick={closeBookingModal} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div style={styles.successState}>
                <div style={styles.successGlow}>✓</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22543D', marginBottom: '0.5rem' }}>Booking Successful!</h3>
                <p style={{ fontSize: '0.9rem', color: '#276749' }}>Session confirmed. Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={styles.form}>
                {/* Counselor detail brief */}
                <div style={styles.modalCounselorBrief}>
                  <img src={selectedCounselor.photo} alt={selectedCounselor.name} style={styles.briefPhoto} />
                  <div>
                    <h4 style={{ fontWeight: 700, color: '#323244' }}>{selectedCounselor.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#20BEE8' }}>{selectedCounselor.expertise}</p>
                  </div>
                </div>

                {/* Option 1: Session mode */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Booking Mode</label>
                  <div style={styles.toggleRow}>
                    <button
                      type="button"
                      onClick={() => setBookingMode('instant')}
                      style={{
                        ...styles.toggleBtn,
                        ...(bookingMode === 'instant' ? styles.toggleBtnActive : {})
                      }}
                    >
                      ⚡ Instant Support (Talk Now)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingMode('scheduled')}
                      style={{
                        ...styles.toggleBtn,
                        ...(bookingMode === 'scheduled' ? styles.toggleBtnActive : {})
                      }}
                    >
                      📅 Scheduled Session
                    </button>
                  </div>
                </div>

                {/* Option 2: Session Type */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Select Session Type</label>
                  <div style={styles.typeGrid}>
                    {[
                      { id: 'text', label: 'Text Chat', icon: MessageSquare },
                      { id: 'audio', label: 'Voice Audio', icon: PhoneCall },
                      { id: 'video', label: 'Video Call', icon: Video }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSessionType(type.id as any)}
                          style={{
                            ...styles.typeBtn,
                            ...(sessionType === type.id ? styles.typeBtnActive : {})
                          }}
                        >
                          <Icon size={16} />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Scheduled inputs */}
                {bookingMode === 'scheduled' && (
                  <div style={styles.dateTimeRow}>
                    <div style={{ flexGrow: 1 }}>
                      <label style={styles.label}>Date</label>
                      <input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div style={{ width: '120px' }}>
                      <label style={styles.label}>Time</label>
                      <input 
                        type="time" 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                >
                  {loading ? 'Confirming...' : `Confirm Booking (+10 pts)`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
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
  disclaimerCard: {
    backgroundColor: '#FAF9F6',
    border: '1px solid rgba(32, 190, 232, 0.15)',
    padding: '1.5rem',
    marginBottom: '3rem',
    borderRadius: '20px'
  },
  counselorCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2rem 1.8rem'
  },
  imageWrapper: {
    position: 'relative',
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #20BEE8',
    marginBottom: '1.2rem'
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  verifyBadge: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#FAF9F6',
    color: '#22543D',
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem'
  },
  counselorName: {
    fontSize: '1.3rem',
    color: '#323244',
    fontWeight: 800,
    marginBottom: '0.3rem'
  },
  expertiseText: {
    fontSize: '0.88rem',
    color: '#20BEE8',
    fontWeight: 600,
    marginBottom: '1.2rem'
  },
  statsContainer: {
    width: '100%',
    borderTop: '1px solid rgba(32, 190, 232, 0.15)',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.88rem',
    color: '#323244',
    marginTop: 'auto'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  availText: {
    color: '#38A169',
    fontWeight: 600
  },
  // Modal Styles
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
    marginBottom: '1.5rem'
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#323244'
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
    borderRadius: '50%'
  },
  successState: {
    textAlign: 'center',
    padding: '2rem 1rem'
  },
  successGlow: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#FAF9F6',
    color: '#22543D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  modalCounselorBrief: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    padding: '0.8rem 1.2rem',
    borderRadius: '16px',
    marginBottom: '0.5rem'
  },
  briefPhoto: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#323244',
    marginBottom: '0.5rem'
  },
  toggleRow: {
    display: 'flex',
    backgroundColor: '#FAF9F6',
    padding: '0.3rem',
    borderRadius: '12px',
    gap: '0.2rem'
  },
  toggleBtn: {
    flexGrow: 1,
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#323244',
    transition: 'all 0.2s'
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    color: '#20BEE8',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.6rem'
  },
  typeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.8rem',
    borderRadius: '12px',
    border: '1.5px solid var(--border-color)',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#323244',
    transition: 'all 0.2s'
  },
  typeBtnActive: {
    borderColor: '#20BEE8',
    backgroundColor: '#FAF9F6',
    color: '#20BEE8'
  },
  dateTimeRow: {
    display: 'flex',
    gap: '0.8rem'
  }
};
