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
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-light rounded-full mb-2">
          <User size={32} weight="duotone" className="text-teal" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">
          Tell us about <span className="text-coral">you</span>
        </h2>
        <p className="text-navy/60 text-lg max-w-sm mx-auto">
          We'll use this to check if medicines are safe for your body.
        </p>
      </div>

      {/* Main Card */}
      <div className="card-organic shadow-soft p-6 md:p-8">
        {/* Health Sync */}
        <button
          onClick={mockSyncHealthData}
          disabled={synced || isSyncing}
          className={`w-full flex items-center justify-center gap-4 p-5 rounded-2xl border-2 transition-all mb-8 ${
            synced
              ? 'border-teal bg-teal-light text-teal'
              : 'border-cream-dark hover:border-coral/50 hover:bg-coral-light/30 text-navy/70'
          }`}
        >
          {isSyncing ? (
            <Heartbeat size={28} className="animate-pulse text-coral" />
          ) : synced ? (
            <CloudCheck size={28} weight="fill" />
          ) : (
            <DeviceMobile size={28} weight="duotone" />
          )}
          <span className="font-semibold text-lg">
            {isSyncing ? 'Importing your data...' : synced ? 'Data imported!' : 'Import from Apple Health / Google Fit'}
          </span>
        </button>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* Age */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy/70">
              <Calendar size={18} weight="duotone" className="text-coral" />
              Your age
            </label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="65"
              className="w-full p-4 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy/70">
              <GenderNeuter size={18} weight="duotone" className="text-coral" />
              Gender
            </label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-4 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy/70">
              <Ruler size={18} weight="duotone" className="text-coral" />
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={profile.height || ''}
              onChange={handleChange}
              placeholder="165"
              className="w-full p-4 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy/70">
              <Scales size={18} weight="duotone" className="text-coral" />
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={profile.weight || ''}
              onChange={handleChange}
              placeholder="70"
              className="w-full p-4 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Ethnicity */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy/70">
              <Globe size={18} weight="duotone" className="text-coral" />
              Ethnicity <span className="text-navy/40 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="ethnicity"
              placeholder="e.g. Asian, Hispanic"
              value={profile.ethnicity}
              onChange={handleChange}
              className="w-full p-4 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            />
          </div>

          {/* Blood Type */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy/70">
              <Drop size={18} weight="duotone" className="text-coral" />
              Blood type <span className="text-navy/40 font-normal">(optional)</span>
            </label>
            <select
              name="bloodType"
              value={profile.bloodType || ''}
              onChange={handleChange}
              className="w-full p-4 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            >
              <option value="">I don't know</option>
              {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-2">
            <FirstAid size={22} weight="duotone" className="text-coral" />
            <h3 className="font-display text-xl font-bold text-navy">Any health conditions?</h3>
          </div>
          <p className="text-navy/60">Tap all that apply — this helps us check for interactions.</p>

          {/* Condition Pills */}
          <div className="flex flex-wrap gap-3">
            {COMMON_CONDITIONS.map(condition => {
              const Icon = CONDITION_ICONS[condition] || Heart;
              const selected = profile.conditions.includes(condition);
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`chip flex items-center gap-2 px-4 py-3 border-2 font-medium ${
                    selected
                      ? 'chip-selected border-teal shadow-sm'
                      : 'border-cream-dark bg-white text-navy/70 hover:border-coral/40 hover:bg-coral-light/20'
                  }`}
                >
                  <Icon size={20} weight={selected ? 'fill' : 'duotone'} />
                  {condition}
                  {selected && <CheckCircle size={18} weight="fill" className="ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Custom conditions */}
          {profile.conditions.filter(c => !COMMON_CONDITIONS.includes(c as any)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.conditions.filter(c => !COMMON_CONDITIONS.includes(c as any)).map(c => (
                <span key={c} className="inline-flex items-center gap-2 px-4 py-2 bg-gold-light text-gold border border-gold/30 rounded-full font-medium">
                  <Sparkle size={16} weight="fill" />
                  {c}
                  <button onClick={() => toggleCondition(c)} className="hover:text-coral-dark">
                    <X size={16} weight="bold" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add custom */}
          <div className="flex gap-3">
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
              placeholder="Add another condition..."
              className="flex-1 p-4 bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={addCustomCondition}
              disabled={!customCondition.trim()}
              className="px-5 bg-navy hover:bg-navy/80 disabled:bg-navy/30 text-white rounded-xl transition-all"
            >
              <Plus size={24} weight="bold" />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => onSave(profile)}
          className="btn-primary w-full mt-10 py-5 text-white font-semibold text-xl flex items-center justify-center gap-3"
        >
          <span>Continue</span>
          <ArrowRight size={24} weight="bold" />
        </button>

        <p className="text-center text-sm text-navy/40 mt-4">
          Your information stays private on your device
        </p>
      </div>
    </div>
  );
};

export default ProfileForm;
