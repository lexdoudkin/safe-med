import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Smartphone, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value
    }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Simple comma separated handling for demo
     const conditions = e.target.value.split(',').map(c => c.trim()).filter(c => c !== '');
     setProfile(prev => ({ ...prev, conditions }));
  };

  const mockSyncHealthData = () => {
    setIsSyncing(true);
    // Simulate API delay
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        age: 34,
        weight: 78,
        height: 175,
        gender: 'Male',
        conditions: [...prev.conditions, 'Seasonal Allergies', 'Mild Hypertension']
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

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
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
              value={profile.height}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-700">Ethnicity (Optional)</label>
            <input
              type="text"
              name="ethnicity"
              placeholder="e.g. Hispanic, South Asian, Caucasian"
              value={profile.ethnicity}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-700">Existing Conditions</label>
            <input
              type="text"
              name="conditions"
              placeholder="e.g. Hypertension, Asthma, Pregnancy (Comma separated)"
              defaultValue={profile.conditions.join(', ')}
              onChange={handleConditionChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
            <p className="text-xs text-slate-400">Separate multiple conditions with commas.</p>
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
