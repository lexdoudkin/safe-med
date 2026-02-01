import React, { useState, useRef } from 'react';

interface DrugInputProps {
  onAnalyze: (text: string, image?: File) => void;
}

const DrugInput: React.FC<DrugInputProps> = ({ onAnalyze }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || image) {
      onAnalyze(text, image || undefined);
    }
  };

  const commonMeds = ['Ibuprofen', 'Aspirin', 'Paracetamol', 'Salbutamol'];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
          Check Medication
        </h1>
        <p style={{ fontSize: '15px', color: '#8E8E93', margin: '6px 0 0 0' }}>
          Enter a medication name or take a photo
        </p>
      </div>

      {/* Input Card */}
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Photo Upload */}
          {preview ? (
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={preview} alt="Medicine" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                height: '120px',
                border: '2px dashed #3A3A3C',
                borderRadius: '12px',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#8E8E93' }}>Add Photo</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Text Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Ibuprofen, Aspirin..."
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim() && !image}
            className="btn-primary"
          >
            Check Safety
          </button>
        </form>
      </div>

      {/* Quick Access */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <span className="section-title">Common Medications</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {commonMeds.map(drug => (
            <button
              key={drug}
              type="button"
              onClick={() => setText(drug)}
              className={`chip ${text === drug ? 'chip-selected' : ''}`}
            >
              {drug}
            </button>
          ))}
        </div>
      </div>

      {/* Health Integration */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <span className="section-title">Sync with Health Apps</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Apple Health */}
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: '#2C2C2E',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF2D55, #FF375F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>Apple Health</div>
              <div style={{ fontSize: '13px', color: '#8E8E93' }}>Import your health data</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8E8E93">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>

          {/* Google Fit / Health Connect */}
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: '#2C2C2E',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4285F4, #34A853)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>Health Connect</div>
              <div style={{ fontSize: '13px', color: '#8E8E93' }}>Sync with Android health apps</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8E8E93">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        Always consult your doctor before taking medication
      </div>
    </div>
  );
};

export default DrugInput;
