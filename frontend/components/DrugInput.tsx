import React, { useState, useRef } from 'react';
import {
  Camera,
  Image as ImageIcon,
  MagnifyingGlass,
  X,
  Pill,
  Lock,
  Sparkle,
  Scan,
  ArrowRight,
} from '@phosphor-icons/react';

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

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in-up pb-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-coral-light rounded-full">
          <Pill size={24} weight="duotone" className="text-coral" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">
          What medicine are you <span className="text-coral">checking?</span>
        </h2>
        <p className="text-navy/60 text-base max-w-md mx-auto">
          Snap a photo or type the name — we'll tell you if it's safe for you.
        </p>
      </div>

      {/* Main Card */}
      <div className="card-organic shadow-soft p-4 md:p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          {preview ? (
            <div className="relative h-40 md:h-48 rounded-xl overflow-hidden bg-navy/5">
              <img src={preview} alt="Medicine" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-navy rounded-full shadow-lg transition-all"
              >
                <X size={20} weight="bold" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <ImageIcon size={18} weight="fill" />
                  Photo ready — tap check below
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-36 md:h-44 border-2 border-dashed border-cream-dark rounded-xl flex flex-col items-center justify-center gap-3 text-navy/50 hover:text-coral hover:border-coral/50 hover:bg-coral-light/20 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-cream-dark group-hover:bg-coral-light rounded-full flex items-center justify-center transition-all">
                <Camera size={28} weight="duotone" className="group-hover:text-coral" />
              </div>
              <div className="text-center">
                <span className="text-base font-semibold block text-navy/70 group-hover:text-coral">
                  Tap to take a photo
                </span>
                <span className="text-sm text-navy/40 block">
                  of your pill, box, or prescription
                </span>
              </div>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-navy/40 font-medium text-xs uppercase tracking-wide">or type it</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {/* Text Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Pill size={20} weight="duotone" className="text-navy/30" />
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={preview ? "Add details (optional)" : "e.g. Ibuprofen, Metformin..."}
              className="w-full pl-11 pr-4 py-3.5 text-lg bg-cream border-2 border-cream-dark rounded-xl focus:border-teal focus:bg-white transition-all placeholder:text-navy/30"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim() && !image}
            className="btn-primary w-full py-4 text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <MagnifyingGlass size={22} weight="bold" />
            <span>Check Safety</span>
            <ArrowRight size={20} weight="bold" />
          </button>
        </form>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-center gap-6 text-navy/40">
        <div className="flex items-center gap-1.5">
          <Lock size={16} weight="duotone" />
          <span className="text-xs font-medium">Private</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkle size={16} weight="duotone" />
          <span className="text-xs font-medium">AI Analysis</span>
        </div>
      </div>
    </div>
  );
};

export default DrugInput;
