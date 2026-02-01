import React from 'react';

// Partner logos as SVG components (Apple Health style - white on dark)
const APHPLogo = () => (
  <svg viewBox="0 0 80 32" style={{ height: '28px', width: 'auto' }}>
    <rect x="0" y="4" width="24" height="24" rx="6" fill="#003366"/>
    <text x="4" y="20" fill="white" fontSize="12" fontWeight="700" fontFamily="system-ui">AP</text>
    <text x="28" y="20" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui">HP</text>
  </svg>
);

const HMPITLogo = () => (
  <svg viewBox="0 0 75 32" style={{ height: '28px', width: 'auto' }}>
    <circle cx="14" cy="16" r="12" fill="#8B0000"/>
    <text x="8" y="20" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">H</text>
    <text x="30" y="19" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">HMPIT</text>
  </svg>
);

const LeaderSanteLogo = () => (
  <svg viewBox="0 0 85 32" style={{ height: '28px', width: 'auto' }}>
    <rect x="0" y="6" width="20" height="20" rx="4" fill="#00A651"/>
    <text x="5" y="20" fill="white" fontSize="12" fontWeight="700" fontFamily="system-ui">L</text>
    <text x="24" y="15" fill="white" fontSize="9" fontWeight="600" fontFamily="system-ui">Leader</text>
    <text x="24" y="24" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="system-ui">Santé</text>
  </svg>
);

const ApriumLogo = () => (
  <svg viewBox="0 0 75 32" style={{ height: '28px', width: 'auto' }}>
    <circle cx="12" cy="16" r="11" fill="#E31937"/>
    <text x="6" y="20" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui">A</text>
    <text x="26" y="19" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">Aprium</text>
  </svg>
);

const XFabLogo = () => (
  <svg viewBox="0 0 60 32" style={{ height: '28px', width: 'auto' }}>
    <rect x="0" y="6" width="20" height="20" rx="4" fill="#1a1a1a" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <text x="4" y="20" fill="#00B4D8" fontSize="12" fontWeight="700" fontFamily="system-ui">X</text>
    <text x="24" y="20" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui">FAB</text>
  </svg>
);

const MinistereLogo = () => (
  <svg viewBox="0 0 90 32" style={{ height: '28px', width: 'auto' }}>
    <rect x="0" y="4" width="24" height="24" rx="4" fill="#C8102E"/>
    <text x="4" y="14" fill="white" fontSize="7" fontWeight="600" fontFamily="system-ui">REP</text>
    <text x="4" y="22" fill="white" fontSize="7" fontWeight="600" fontFamily="system-ui">TUN</text>
    <text x="28" y="18" fill="white" fontSize="9" fontWeight="600" fontFamily="system-ui">Min. Santé</text>
  </svg>
);

const TrustedPartners: React.FC = () => {
  return (
    <div className="animate-fade-up animate-delay-4" style={{ width: '100%', maxWidth: '400px' }}>
      {/* Quote Card - Glass effect */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontStyle: 'italic',
          margin: '0 0 8px 0',
          lineHeight: '1.5',
          textAlign: 'center'
        }}>
          "La digitalisation et la sécurité des patients sont des priorités stratégiques."
        </p>
        <p style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          margin: 0,
          textAlign: 'center'
        }}>
          — Pr. Mustapha Ferjani, Ministre de la Santé
        </p>
      </div>

      {/* Partners Label */}
      <p style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'rgba(255, 255, 255, 0.4)',
        margin: '0 0 12px 0',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        Trusted Partners
      </p>

      {/* Logos Grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        opacity: 0.85
      }}>
        <APHPLogo />
        <HMPITLogo />
        <LeaderSanteLogo />
        <ApriumLogo />
        <XFabLogo />
        <MinistereLogo />
      </div>
    </div>
  );
};

export default TrustedPartners;
