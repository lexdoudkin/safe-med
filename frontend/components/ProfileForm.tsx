import React, { useState } from 'react';
import { UserProfile, COMMON_CONDITIONS } from '../types';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

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
    <div className="space-y-4 animate-in">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold text-black">Your Profile</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Help us personalize your results</p>
      </div>

      {/* Basic Info Card */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
          Basic Info
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#8E8E93] mb-1 block">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="30"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-[#8E8E93] mb-1 block">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8E8E93] mb-1 block">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height || ''}
              onChange={handleChange}
              placeholder="170"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-[#8E8E93] mb-1 block">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight || ''}
              onChange={handleChange}
              placeholder="70"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Health Conditions Card */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
          Health Conditions
        </h2>
        <div className="flex flex-wrap gap-2">
          {COMMON_CONDITIONS.map(condition => {
            const selected = profile.conditions.includes(condition);
            return (
              <button
                key={condition}
                type="button"
                onClick={() => toggleCondition(condition)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  selected
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-[#F2F2F7] text-[#3C3C43]'
                }`}
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
        className="w-full py-4 bg-[#007AFF] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
      >
        Continue
      </button>

      <p className="text-center text-xs text-[#8E8E93]">
        Your data stays on your device
      </p>
    </div>
  );
};

export default ProfileForm;
