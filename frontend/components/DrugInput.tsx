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
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#000000', margin: 0 }}>
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

      {/* Disclaimer */}
      <div className="disclaimer">
        Always consult your doctor before taking medication
      </div>
    </div>
  );
};

export default DrugInput;
