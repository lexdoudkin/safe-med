import React, { useState } from 'react';
import { UserProfile, COMMON_CONDITIONS } from '../types';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value
    }));
  };

  const toggleCondition = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
          Your Profile
        </h1>
        <p style={{ fontSize: '15px', color: '#8E8E93', margin: '6px 0 0 0' }}>
          Help us personalize your results
        </p>
      </div>

      {/* Basic Info Card */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <div className="section-icon" style={{ background: '#007AFF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span className="section-title">Basic Info</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="30"
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height || ''}
              onChange={handleChange}
              placeholder="170"
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '6px', display: 'block' }}>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight || ''}
              onChange={handleChange}
              placeholder="70"
            />
          </div>
        </div>
      </div>

      {/* Health Conditions Card */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <div className="section-icon" style={{ background: '#FF3B30' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="section-title">Health Conditions</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {COMMON_CONDITIONS.map(condition => {
            const selected = profile.conditions.includes(condition);
            return (
              <button
                key={condition}
                type="button"
                onClick={() => toggleCondition(condition)}
                className={`chip ${selected ? 'chip-selected' : ''}`}
              >
                {condition}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => onSave(profile)}
        className="btn-primary"
      >
        Continue
      </button>

      {/* Privacy Note */}
      <div className="disclaimer">
        Your data stays on your device
      </div>
    </div>
  );
};

export default ProfileForm;
