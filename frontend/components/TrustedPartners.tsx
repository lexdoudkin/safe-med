import React from 'react';

// Partner logos as SVG components
const APHPLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: '10px', fontWeight: '700' }}>AP</span>
    </div>
    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>AP-HP</span>
  </div>
);

const HMPITLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8B0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>H</span>
    </div>
    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>HMPIT Tunis</span>
  </div>
);

const LeaderSanteLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>L</span>
    </div>
    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Leader Santé</span>
  </div>
);

const ApriumLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E31937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>A</span>
    </div>
    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Aprium</span>
  </div>
);

const XFabLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#00B4D8', fontSize: '12px', fontWeight: '700' }}>X</span>
    </div>
    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>X-FAB</span>
  </div>
);

const MinistereLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <span style={{ color: 'white', fontSize: '6px', fontWeight: '600', lineHeight: 1 }}>MIN</span>
      <span style={{ color: 'white', fontSize: '6px', fontWeight: '600', lineHeight: 1 }}>TUN</span>
    </div>
    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Min. Santé</span>
  </div>
);

const PharmaciePorteItalie = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2E7D32, #4CAF50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: '16px' }}>+</span>
    </div>
    <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>Porte d'Italie</span>
  </div>
);

const PharmacieBenAyed = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1565C0, #42A5F5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'white', fontSize: '16px' }}>+</span>
    </div>
    <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>Ben Ayed</span>
  </div>
);

const TrustedPartners: React.FC = () => {
  return (
    <div className="animate-fade-up animate-delay-4" style={{ width: '100%', overflow: 'hidden' }}>
      {/* Quote Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '380px',
        margin: '0 auto 20px'
      }}>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.95)',
          fontStyle: 'italic',
          margin: '0 0 8px 0',
          lineHeight: '1.5',
          textAlign: 'center'
        }}>
          "La digitalisation et la sécurité des patients sont des priorités stratégiques."
        </p>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.6)',
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
        letterSpacing: '1.5px',
        color: 'rgba(255, 255, 255, 0.5)',
        margin: '0 0 16px 0',
        textAlign: 'center',
        fontWeight: '600'
      }}>
        Trusted by healthcare leaders
      </p>

      {/* Scrolling Banner - First Row */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          animation: 'scroll-left 25s linear infinite',
          width: 'max-content'
        }}>
          <APHPLogo />
          <HMPITLogo />
          <LeaderSanteLogo />
          <ApriumLogo />
          <XFabLogo />
          <MinistereLogo />
          <PharmaciePorteItalie />
          <PharmacieBenAyed />
          {/* Duplicate for seamless loop */}
          <APHPLogo />
          <HMPITLogo />
          <LeaderSanteLogo />
          <ApriumLogo />
          <XFabLogo />
          <MinistereLogo />
          <PharmaciePorteItalie />
          <PharmacieBenAyed />
        </div>
      </div>

      {/* Scrolling Banner - Second Row (reverse direction) */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          animation: 'scroll-right 30s linear infinite',
          width: 'max-content'
        }}>
          <PharmacieBenAyed />
          <MinistereLogo />
          <XFabLogo />
          <ApriumLogo />
          <LeaderSanteLogo />
          <HMPITLogo />
          <APHPLogo />
          <PharmaciePorteItalie />
          {/* Duplicate for seamless loop */}
          <PharmacieBenAyed />
          <MinistereLogo />
          <XFabLogo />
          <ApriumLogo />
          <LeaderSanteLogo />
          <HMPITLogo />
          <APHPLogo />
          <PharmaciePorteItalie />
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default TrustedPartners;
