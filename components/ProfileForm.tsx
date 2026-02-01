import React, { useState } from 'react';
import { UserProfile, COMMON_CONDITIONS } from '../types';
import {
  DeviceMobile,
  CheckCircle,
  CaretRight,
  Heartbeat,
  Plus,
  X,
  Scales,
  Ruler,
  Calendar,
  GenderIntersex,
  Drop,
  Globe,
  FirstAid,
  Sparkle,
  Heart,
  Baby,
  Wind,
  Flask,
  Flower,
  ChartLine,
  Atom,
  Bone,
  Brain,
} from '@phosphor-icons/react';
import { MedicalIllustrations } from './HealthIcons';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// Condition icons mapping
const CONDITION_ICONS: Record<string, React.FC<{ size?: number; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'; className?: string }>> = {
  'Hypertension': Heartbeat,
  'Pregnancy': Baby,
  'Asthma': Wind,
  'Diabetes': Drop,
  'Heart Disease': Heart,
  'Kidney Disease': Flask,
  'Liver Disease': Flask,
  'Allergies': Flower,
  'High Cholesterol': ChartLine,
  'Thyroid Disorder': Atom,
};

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [customCondition, setCustomCondition] = useState('');

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

  const addCustomCondition = () => {
    if (customCondition.trim() && !profile.conditions.includes(customCondition.trim())) {
      setProfile(prev => ({
        ...prev,
        conditions: [...prev.conditions, customCondition.trim()]
      }));
      setCustomCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c !== condition)
    }));
  };

  const mockSyncHealthData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        age: 34,
        weight: 78,
        height: 175,
        gender: 'Male',
        bloodType: 'O+',
        conditions: [...new Set([...prev.conditions, 'Seasonal Allergies', 'Hypertension'])]
      }));
      setIsSyncing(false);
      setSynced(true);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in px-2">
      {/* Header with illustration */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <MedicalIllustrations.HealthProfile />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Your Health Profile</h2>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Tell us about yourself so we can give you <span className="font-semibold text-emerald-600">personalized</span> drug safety advice.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        {/* Health Sync Button */}
        <div className="mb-10">
          <button
            onClick={mockSyncHealthData}
            disabled={synced || isSyncing}
            className={`w-full flex items-center justify-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
              synced
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-600'
            }`}
          >
            {isSyncing ? (
              <Heartbeat size={28} weight="bold" className="animate-pulse" />
            ) : synced ? (
              <CheckCircle size={28} weight="fill" />
            ) : (
              <DeviceMobile size={28} weight="duotone" />
            )}
            <span className="font-semibold text-lg">
              {isSyncing ? 'Syncing your health data...' : synced ? 'Health Data Synced!' : 'Sync with Apple Health / Google Fit'}
            </span>
          </button>
          <p className="text-center text-sm text-slate-400 mt-2">
            Automatically import your health data
          </p>
        </div>

        {/* Basic Info - Senior Friendly Large Inputs */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FirstAid size={24} weight="duotone" className="text-emerald-600" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <Calendar size={20} weight="duotone" className="text-slate-500" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={profile.age || ''}
                onChange={handleChange}
                placeholder="e.g. 65"
                className="w-full p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <GenderIntersex size={20} weight="duotone" className="text-slate-500" />
                Gender
              </label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <Ruler size={20} weight="duotone" className="text-slate-500" />
                Height (cm)
              </label>
              <input
                type="number"
                name="height"
                value={profile.height || ''}
                onChange={handleChange}
                placeholder="e.g. 170"
                className="w-full p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <Scales size={20} weight="duotone" className="text-slate-500" />
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={profile.weight || ''}
                onChange={handleChange}
                placeholder="e.g. 75"
                className="w-full p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            {/* Ethnicity */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <Globe size={20} weight="duotone" className="text-slate-500" />
                Ethnicity
                <span className="text-sm font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                type="text"
                name="ethnicity"
                placeholder="e.g. Caucasian, Asian, Hispanic"
                value={profile.ethnicity}
                onChange={handleChange}
                className="w-full p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            {/* Blood Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-slate-700">
                <Drop size={20} weight="duotone" className="text-red-500" />
                Blood Type
                <span className="text-sm font-normal text-slate-400">(Optional)</span>
              </label>
              <select
                name="bloodType"
                value={profile.bloodType || ''}
                onChange={handleChange}
                className="w-full p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
              >
                <option value="">I don't know</option>
                {BLOOD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="mt-10 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Heartbeat size={24} weight="duotone" className="text-rose-500" />
            Health Conditions
          </h3>
          <p className="text-slate-600 text-base">
            Select any conditions that apply to you. This helps us identify potential drug interactions.
          </p>

          {/* Common Conditions as Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMMON_CONDITIONS.map(condition => {
              const IconComponent = CONDITION_ICONS[condition] || Heart;
              const isSelected = profile.conditions.includes(condition);

              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all border-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    <IconComponent
                      size={24}
                      weight={isSelected ? 'fill' : 'duotone'}
                      className={isSelected ? 'text-emerald-600' : 'text-slate-500'}
                    />
                  </div>
                  <span className="font-medium text-sm md:text-base">{condition}</span>
                  {isSelected && (
                    <CheckCircle size={20} weight="fill" className="text-emerald-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Custom Conditions */}
          {profile.conditions.filter(c => !COMMON_CONDITIONS.includes(c as any)).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">Other conditions:</p>
              <div className="flex flex-wrap gap-2">
                {profile.conditions
                  .filter(c => !COMMON_CONDITIONS.includes(c as any))
                  .map(condition => (
                    <span
                      key={condition}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-medium"
                    >
                      <Sparkle size={16} weight="fill" className="text-blue-500" />
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="hover:bg-blue-200 rounded-full p-1 transition-colors"
                        aria-label={`Remove ${condition}`}
                      >
                        <X size={16} weight="bold" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Add Custom Condition */}
          <div className="flex gap-3">
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
              placeholder="Add another condition..."
              className="flex-1 p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={addCustomCondition}
              disabled={!customCondition.trim()}
              className="px-5 py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
              aria-label="Add condition"
            >
              <Plus size={24} weight="bold" />
            </button>
          </div>
        </div>

        {/* Continue Button - Extra Large for seniors */}
        <button
          onClick={() => onSave(profile)}
          className="w-full mt-10 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-xl"
        >
          <span>Continue to Drug Check</span>
          <CaretRight size={28} weight="bold" />
        </button>

        <p className="text-center text-sm text-slate-400 mt-4">
          Your data is private and never shared
        </p>
      </div>
    </div>
  );
};

export default ProfileForm;
