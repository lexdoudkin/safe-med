import React, { useState, useRef } from 'react';
import {
  Camera,
  Image as ImageIcon,
  MagnifyingGlass,
  X,
  Pill,
  ShieldCheck,
  Lock,
  Sparkle,
  Upload,
  Scan,
} from '@phosphor-icons/react';
import { MedicalIllustrations } from './HealthIcons';

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
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
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

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-2">
      {/* Header with illustration */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <MedicalIllustrations.Medicine />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Check Your Medicine</h2>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Take a photo of your medicine or type its name. We'll check if it's safe <span className="font-semibold text-emerald-600">for you</span>.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload Area */}
          {preview ? (
            <div className="relative w-full h-56 md:h-64 bg-slate-100 rounded-2xl overflow-hidden group">
              <img src={preview} alt="Drug Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                aria-label="Remove image"
              >
                <X size={24} weight="bold" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-white text-lg font-medium flex items-center gap-2">
                  <ImageIcon size={24} weight="fill" />
                  Photo attached - ready to analyze
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 md:h-56 border-3 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-slate-100 group-hover:bg-emerald-100 rounded-2xl transition-colors">
                <Camera size={48} weight="duotone" className="group-hover:text-emerald-600" />
              </div>
              <div className="text-center">
                <span className="text-xl font-semibold block">Tap to take a photo</span>
                <span className="text-base text-slate-400 mt-1 block">or upload an image of your medicine</span>
              </div>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            aria-label="Upload medicine image"
          />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-slate-400 font-medium">or type the name</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Text Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Pill size={28} weight="duotone" className="text-slate-400" />
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={preview ? "Add more details (optional)" : "Type medicine name here..."}
              className="w-full pl-16 pr-5 py-5 text-xl bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!text.trim() && !image}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 text-xl"
          >
            <MagnifyingGlass size={28} weight="bold" />
            <span>Check Safety</span>
            <Sparkle size={24} weight="fill" className="text-emerald-200" />
          </button>
        </form>
      </div>

      {/* Trust Badges - Larger for seniors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center">
          <Lock size={32} weight="duotone" className="text-blue-600 mx-auto mb-2" />
          <p className="text-blue-900 font-bold text-base">100% Private</p>
          <p className="text-blue-700 text-sm mt-1">Your data stays on your device</p>
        </div>
        <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 text-center">
          <Sparkle size={32} weight="duotone" className="text-purple-600 mx-auto mb-2" />
          <p className="text-purple-900 font-bold text-base">AI Powered</p>
          <p className="text-purple-700 text-sm mt-1">Latest medical research</p>
        </div>
      </div>
    </div>
  );
};

export default DrugInput;
