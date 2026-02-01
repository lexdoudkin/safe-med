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

  return (
    <div className="space-y-4 animate-in">
      {/* Header */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold text-black">Check Medication</h1>
        <p className="text-[#8E8E93] text-sm mt-1">Enter a medication name or take a photo</p>
      </div>

      {/* Input Card */}
      <div className="card p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          {preview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="Medicine" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-[#E5E5EA] rounded-xl flex flex-col items-center justify-center gap-2 text-[#8E8E93] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="text-sm font-medium">Add Photo</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Ibuprofen, Aspirin..."
            className="w-full"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim() && !image}
            className="w-full py-4 bg-[#007AFF] text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            Check Safety
          </button>
        </form>
      </div>

      {/* Quick Access */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
          Common Medications
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Ibuprofen', 'Aspirin', 'Paracetamol', 'Salbutamol'].map(drug => (
            <button
              key={drug}
              type="button"
              onClick={() => setText(drug)}
              className="px-3 py-2 bg-[#F2F2F7] rounded-full text-sm font-medium text-[#3C3C43] active:bg-[#E5E5EA]"
            >
              {drug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrugInput;
