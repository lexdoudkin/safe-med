import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Search, X, Pill } from 'lucide-react';

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
    <div className="max-w-xl mx-auto space-y-6">
       <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">What are you taking?</h2>
        <p className="text-slate-500">Upload a photo of the package/pill or type the name.</p>
      </div>

      <div className="bg-white p-1 rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
            
            {/* Image Preview Area */}
            {preview ? (
                <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden group">
                    <img src={preview} alt="Drug Preview" className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Image attached
                        </p>
                    </div>
                </div>
            ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer"
                >
                    <Camera className="w-8 h-8" />
                    <span className="text-sm font-medium">Tap to scan pill or box</span>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Pill className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={preview ? "Add context (optional)" : "Or type drug name..."}
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
            </div>

            <button
                type="submit"
                disabled={!text.trim() && !image}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
                <Search className="w-5 h-5" />
                <span>Analyze Safety</span>
            </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <p className="text-blue-900 font-semibold text-sm">Strictly Private</p>
            <p className="text-blue-700 text-xs">Data processed securely</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
            <p className="text-purple-900 font-semibold text-sm">AI Powered</p>
            <p className="text-purple-700 text-xs">Latest medical data</p>
        </div>
      </div>
    </div>
  );
};

export default DrugInput;
