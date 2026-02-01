import React from 'react';

// Partner logos as styled components for light background
const PartnerPill: React.FC<{
  icon: React.ReactNode;
  name: string;
  bgColor: string;
}> = ({ icon, name, bgColor }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.04)',
    flexShrink: 0
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      {icon}
    </div>
    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1D1D1F', whiteSpace: 'nowrap' }}>{name}</span>
  </div>
);

// Partner data
const partners = [
  {
    name: 'AP-HP Paris',
    bgColor: '#003366',
    icon: <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>AP</span>
  },
  {
    name: 'HMPIT Tunis',
    bgColor: '#8B0000',
    icon: <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>H</span>
  },
  {
    name: 'Leader Santé',
    bgColor: '#00A651',
    icon: <span style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>L</span>
  },
  {
    name: 'Aprium',
    bgColor: '#E31937',
    icon: <span style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>A</span>
  },
  {
    name: 'X-FAB',
    bgColor: '#1a1a1a',
    icon: <span style={{ color: '#00B4D8', fontSize: '14px', fontWeight: '700' }}>X</span>
  },
  {
    name: 'Min. Santé Tunisie',
    bgColor: '#C8102E',
    icon: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: '7px', fontWeight: '600', lineHeight: 1 }}>MIN</span>
        <span style={{ color: 'white', fontSize: '7px', fontWeight: '600', lineHeight: 1 }}>TUN</span>
      </div>
    )
  },
  {
    name: 'Pharmacie Porte d\'Italie',
    bgColor: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
    icon: <span style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>+</span>
  },
  {
    name: 'Pharmacie Ben Ayed',
    bgColor: 'linear-gradient(135deg, #1565C0, #42A5F5)',
    icon: <span style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>+</span>
  },
];

const TrustedPartners: React.FC = () => {
  return (
    <section style={{
      padding: '80px 24px',
      background: '#F8F9FA',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#000', margin: '0 0 16px 0' }}>
            Trusted by Healthcare Leaders
          </h2>
          <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
            Working with hospitals, pharmacies, and health institutions across France and Tunisia
          </p>
        </div>

        {/* Quote */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 40px',
          padding: '24px 32px',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          borderLeft: '4px solid #007AFF'
        }}>
          <p style={{
            fontSize: '18px',
            color: '#374151',
            fontStyle: 'italic',
            margin: '0 0 12px 0',
            lineHeight: '1.6'
          }}>
            "La digitalisation et la sécurité des patients sont des priorités stratégiques pour transformer notre système de santé."
          </p>
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            margin: 0,
            fontWeight: '500'
          }}>
            — Pr. Mustapha Ferjani, Ministre de la Santé, Tunisie
          </p>
        </div>

        {/* Scrolling Partners - Row 1 */}
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          marginBottom: '16px',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            animation: 'scrollLeft 30s linear infinite',
            width: 'max-content'
          }}>
            {[...partners, ...partners].map((partner, i) => (
              <PartnerPill key={i} {...partner} />
            ))}
          </div>
        </div>

        {/* Scrolling Partners - Row 2 (reverse) */}
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            animation: 'scrollRight 35s linear infinite',
            width: 'max-content'
          }}>
            {[...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, i) => (
              <PartnerPill key={i} {...partner} />
            ))}
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default TrustedPartners;
