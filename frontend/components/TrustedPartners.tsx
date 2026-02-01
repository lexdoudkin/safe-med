import React from 'react';

const APHPLogo = () => (
  <svg viewBox="0 0 80 28" className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity">
    <rect x="0" y="4" width="20" height="20" rx="3" fill="#003366"/>
    <text x="4" y="18" fill="white" fontSize="11" fontWeight="bold">AP</text>
    <text x="24" y="18" fill="#003366" fontSize="14" fontWeight="bold">HP</text>
  </svg>
);

const HMPITLogo = () => (
  <svg viewBox="0 0 70 28" className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity">
    <circle cx="12" cy="14" r="10" fill="#8B0000"/>
    <text x="7" y="18" fill="white" fontSize="9" fontWeight="bold">H</text>
    <text x="26" y="17" fill="#8B0000" fontSize="10" fontWeight="bold">HMPIT</text>
  </svg>
);

const LeaderSanteLogo = () => (
  <svg viewBox="0 0 80 28" className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity">
    <rect x="0" y="6" width="16" height="16" rx="2" fill="#00A651"/>
    <text x="3" y="18" fill="white" fontSize="10" fontWeight="bold">L</text>
    <text x="20" y="15" fill="#00A651" fontSize="9" fontWeight="bold">Leader</text>
    <text x="20" y="23" fill="#666" fontSize="7">Santé</text>
  </svg>
);

const ApriumLogo = () => (
  <svg viewBox="0 0 70 28" className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity">
    <circle cx="10" cy="14" r="9" fill="#E31937"/>
    <text x="5" y="18" fill="white" fontSize="10" fontWeight="bold">A</text>
    <text x="22" y="17" fill="#E31937" fontSize="10" fontWeight="bold">Aprium</text>
  </svg>
);

const XFabLogo = () => (
  <svg viewBox="0 0 55 28" className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity">
    <rect x="0" y="6" width="16" height="16" rx="2" fill="#1a1a1a"/>
    <text x="3" y="18" fill="#00B4D8" fontSize="10" fontWeight="bold">X</text>
    <text x="20" y="18" fill="#1a1a1a" fontSize="11" fontWeight="bold">FAB</text>
  </svg>
);

const MinistereLogo = () => (
  <svg viewBox="0 0 85 28" className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity">
    <rect x="0" y="4" width="20" height="20" rx="2" fill="#C8102E"/>
    <text x="3" y="12" fill="white" fontSize="6" fontWeight="bold">REP</text>
    <text x="3" y="20" fill="white" fontSize="6" fontWeight="bold">TUN</text>
    <text x="24" y="16" fill="#C8102E" fontSize="8" fontWeight="bold">Min. Santé</text>
  </svg>
);

const TrustedPartners: React.FC = () => {
  return (
    <div className="w-full max-w-lg">
      {/* Quote */}
      <div className="bg-white/50 rounded-lg px-3 py-2 mb-3 border border-navy/5">
        <p className="text-navy/70 text-xs italic text-center leading-snug">
          "La digitalisation et la sécurité des patients sont des priorités stratégiques."
        </p>
        <p className="text-navy/50 text-[10px] text-center mt-1">
          — Pr. Mustapha Ferjani, Ministre de la Santé
        </p>
      </div>

      {/* Logos Grid */}
      <p className="text-[10px] uppercase tracking-wider text-navy/40 font-medium mb-2 text-center">
        Ils nous font confiance
      </p>
      <div className="flex flex-wrap justify-center items-center gap-3">
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
