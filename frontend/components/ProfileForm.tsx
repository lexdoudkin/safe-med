import React, { useState } from 'react';
import { UserProfile, COMMON_CONDITIONS } from '../types';
import {
  DeviceMobile,
  CheckCircle,
  ArrowRight,
  Heartbeat,
  Plus,
  X,
  Scales,
  Ruler,
  Calendar,
  GenderNeuter,
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
  CloudCheck,
  User,
  HandHeart,
} from '@phosphor-icons/react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

const CONDITION_ICONS: Record<string, React.FC<any>> = {
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
      setProfile(prev => ({ ...prev, conditions: [...prev.conditions, customCondition.trim()] }));
      setCustomCondition('');
    }
  };

  const mockSyncHealthData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        age: 67,
        weight: 72,
        height: 168,
        gender: 'Female',
        bloodType: 'A+',
        conditions: [...new Set([...prev.conditions, 'Hypertension', 'High Cholesterol'])]
      }));
      setIsSyncing(false);
      setSynced(true);
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up pb-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-light rounded-full">
          <User size={24} weight="duotone" className="text-teal" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
          Tell us about <span className="text-coral">you</span>
        </h2>
        <p className="text-navy/60 text-base max-w-sm mx-auto">
          We'll use this to check if medicines are safe for your body.
        </p>
      </div>

      {/* Main Card */}
      <div className="card-organic shadow-soft p-4 md:p-5">
        {/* Health Sync */}
        <button
          onClick={mockSyncHealthData}
          disabled={synced || isSyncing}
          className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all mb-4 ${
            synced
              ? 'border-teal bg-teal-light text-teal'
              : 'border-cream-dark hover:border-coral/50 hover:bg-coral-light/30 text-navy/70'
          }`}
        >
          {isSyncing ? (
            <Heartbeat size={22} className="animate-pulse text-coral" />
          ) : synced ? (
            <CloudCheck size={22} weight="fill" />
          ) : (
            <DeviceMobile size={22} weight="duotone" />
          )}
          <span className="font-semibold text-base">
            {isSyncing ? 'Importing...' : synced ? 'Data imported!' : 'Import from Apple Health / Google Fit'}
          </span>
        </button>

        {/* Form Grid - More Compact */}
        <div className="grid grid-cols-3 gap-3">
          {/* Age */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-navy/70">
              <Calendar size={14} weight="duotone" className="text-coral" />
              Age
            </label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="65"
              className="w-full p-2.5 text-base bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-navy/70">
              <GenderNeuter size={14} weight="duotone" className="text-coral" />
              Gender
            </label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-2.5 text-base bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Type */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-navy/70">
              <Drop size={14} weight="duotone" className="text-coral" />
              Blood
            </label>
            <select
              name="bloodType"
              value={profile.bloodType || ''}
              onChange={handleChange}
              className="w-full p-2.5 text-base bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            >
              <option value="">Unknown</option>
              {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Height */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-navy/70">
              <Ruler size={14} weight="duotone" className="text-coral" />
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={profile.height || ''}
              onChange={handleChange}
              placeholder="165"
              className="w-full p-2.5 text-base bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-navy/70">
              <Scales size={14} weight="duotone" className="text-coral" />
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={profile.weight || ''}
              onChange={handleChange}
              placeholder="70"
              className="w-full p-2.5 text-base bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Ethnicity */}
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-navy/70">
              <Globe size={14} weight="duotone" className="text-coral" />
              Ethnicity
            </label>
            <input
              type="text"
              name="ethnicity"
              placeholder="Optional"
              value={profile.ethnicity}
              onChange={handleChange}
              className="w-full p-2.5 text-base bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Conditions Section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <FirstAid size={18} weight="duotone" className="text-coral" />
            <h3 className="font-display text-base font-bold text-navy">Health conditions</h3>
            <span className="text-xs text-navy/40">(tap all that apply)</span>
          </div>

          {/* Condition Pills - Compact */}
          <div className="flex flex-wrap gap-2">
            {COMMON_CONDITIONS.map(condition => {
              const Icon = CONDITION_ICONS[condition] || Heart;
              const selected = profile.conditions.includes(condition);
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`chip flex items-center gap-1.5 px-3 py-2 border-2 text-sm font-medium ${
                    selected
                      ? 'chip-selected border-teal shadow-sm'
                      : 'border-cream-dark bg-white text-navy/70 hover:border-coral/40 hover:bg-coral-light/20'
                  }`}
                >
                  <Icon size={16} weight={selected ? 'fill' : 'duotone'} />
                  {condition}
                  {selected && <CheckCircle size={14} weight="fill" />}
                </button>
              );
            })}
          </div>

          {/* Custom conditions */}
          {profile.conditions.filter(c => !COMMON_CONDITIONS.includes(c as any)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.conditions.filter(c => !COMMON_CONDITIONS.includes(c as any)).map(c => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-light text-gold border border-gold/30 rounded-full text-sm font-medium">
                  <Sparkle size={14} weight="fill" />
                  {c}
                  <button onClick={() => toggleCondition(c)} className="hover:text-coral-dark">
                    <X size={14} weight="bold" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add custom */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
              placeholder="Add another condition..."
              className="flex-1 p-2.5 text-sm bg-cream border-2 border-cream-dark rounded-lg focus:border-teal focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={addCustomCondition}
              disabled={!customCondition.trim()}
              className="px-4 bg-navy hover:bg-navy/80 disabled:bg-navy/30 text-white rounded-lg transition-all"
            >
              <Plus size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => onSave(profile)}
          className="btn-primary w-full mt-5 py-4 text-white font-semibold text-lg flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight size={20} weight="bold" />
        </button>

        <p className="text-center text-xs text-navy/40 mt-2">
          Your information stays private on your device
        </p>
      </div>
    </div>
  );
};

export default ProfileForm;
