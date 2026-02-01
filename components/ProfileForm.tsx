import React, { useState } from 'react';
import { UserProfile, COMMON_CONDITIONS } from '../types';
import { Smartphone, CheckCircle2, ChevronRight, Activity, Plus, X } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

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
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Your Health Profile</h2>
        <p className="text-slate-500">We analyze drugs based on your unique biology.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        {/* Health Sync Button */}
        <div className="mb-8">
          <button
            onClick={mockSyncHealthData}
            disabled={synced || isSyncing}
            className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
              synced
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-600'
            }`}
          >
            {isSyncing ? (
              <Activity className="w-5 h-5 animate-spin" />
            ) : synced ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {isSyncing ? 'Syncing...' : synced ? 'Health Data Synced' : 'Sync Apple/Google Health'}
            </span>
          </button>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="25"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height || ''}
              onChange={handleChange}
              placeholder="175"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight || ''}
              onChange={handleChange}
              placeholder="70"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ethnicity <span className="text-slate-400">(Optional)</span></label>
            <input
              type="text"
              name="ethnicity"
              placeholder="e.g. Hispanic, South Asian"
              value={profile.ethnicity}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Blood Type <span className="text-slate-400">(Optional)</span></label>
            <select
              name="bloodType"
              value={profile.bloodType || ''}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            >
              <option value="">Unknown</option>
              {BLOOD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="mt-8 space-y-4">
          <label className="text-sm font-medium text-slate-700">Existing Conditions</label>

          {/* Common Conditions Chips */}
          <div className="flex flex-wrap gap-2">
            {COMMON_CONDITIONS.map(condition => (
              <button
                key={condition}
                type="button"
                onClick={() => toggleCondition(condition)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  profile.conditions.includes(condition)
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>

          {/* Selected Custom Conditions */}
          {profile.conditions.filter(c => !COMMON_CONDITIONS.includes(c as any)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.conditions
                .filter(c => !COMMON_CONDITIONS.includes(c as any))
                .map(condition => (
                  <span
                    key={condition}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(condition)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}

          {/* Add Custom Condition */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
              placeholder="Add other condition..."
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={addCustomCondition}
              disabled={!customCondition.trim()}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <button
          onClick={() => onSave(profile)}
          className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Analysis</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
