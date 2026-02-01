import React from 'react';
import {
  Heart,
  Baby,
  Wind,
  Drop,
  Heartbeat,
  Bone,
  Flask,
  Flower,
  Pill,
  Syringe,
  FirstAid,
  Stethoscope,
  Thermometer,
  Bandaids,
  Brain,
  Eye,
  Ear,
  Tooth,
  HandHeart,
  Person,
  Wheelchair,
  Virus,
  Dna,
  Atom,
  Lightning,
  Moon,
  Sun,
  Warning,
  ShieldCheck,
  ShieldWarning,
  CheckCircle,
  XCircle,
  Info,
  Question,
  Camera,
  Image,
  MagnifyingGlass,
  Upload,
  Sparkle,
  Star,
  Pulse,
  ChartLine,
  ClipboardText,
  FileText,
  BookOpen,
  GraduationCap,
  Leaf,
  Coffee,
  Barbell,
  Bed,
  Clock,
  Calendar,
  Phone,
  DeviceMobile,
  Devices,
  CloudArrowUp,
  CloudCheck,
  UserCircle,
  Users,
  House,
  MapPin,
  Globe,
  Scales,
  Ruler,
  Timer,
  Hourglass,
} from '@phosphor-icons/react';

// Medical condition icons mapping with sketched/friendly style
export const CONDITION_ICONS: Record<string, React.FC<{ size?: number; weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'; className?: string }>> = {
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
  'Anxiety': Brain,
  'Depression': Moon,
  'Arthritis': Bone,
  'Cancer': Virus,
  'COPD': Wind,
  'Epilepsy': Lightning,
  'Migraine': Brain,
  'Osteoporosis': Bone,
  'Stroke': Brain,
  'HIV/AIDS': Virus,
};

// Get icon for a condition (with fallback)
export const getConditionIcon = (condition: string) => {
  return CONDITION_ICONS[condition] || Pill;
};

// Sketched medical illustration components
export const MedicalIllustrations = {
  // Friendly doctor/patient illustration using icons
  Doctor: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-emerald-100 rounded-full p-6">
        <Stethoscope size={48} weight="duotone" className="text-emerald-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <Heart size={20} weight="fill" className="text-red-400" />
      </div>
    </div>
  ),

  // Health profile illustration
  HealthProfile: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-blue-100 rounded-full p-6">
        <ClipboardText size={48} weight="duotone" className="text-blue-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <CheckCircle size={20} weight="fill" className="text-emerald-500" />
      </div>
    </div>
  ),

  // Medicine/Drug illustration
  Medicine: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-purple-100 rounded-full p-6">
        <Pill size={48} weight="duotone" className="text-purple-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <MagnifyingGlass size={20} weight="bold" className="text-slate-600" />
      </div>
    </div>
  ),

  // Safety/Protection illustration
  Safety: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-green-100 rounded-full p-6">
        <ShieldCheck size={48} weight="duotone" className="text-green-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <Sparkle size={20} weight="fill" className="text-amber-500" />
      </div>
    </div>
  ),

  // Warning/Risk illustration
  Risk: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-amber-100 rounded-full p-6">
        <ShieldWarning size={48} weight="duotone" className="text-amber-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <Warning size={20} weight="fill" className="text-red-500" />
      </div>
    </div>
  ),

  // Scan/Camera illustration
  Scan: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-indigo-100 rounded-full p-6">
        <Camera size={48} weight="duotone" className="text-indigo-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <Sparkle size={20} weight="fill" className="text-indigo-400" />
      </div>
    </div>
  ),

  // Sync/Cloud illustration
  Sync: ({ className = '' }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="bg-cyan-100 rounded-full p-6">
        <Devices size={48} weight="duotone" className="text-cyan-600" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
        <CloudCheck size={20} weight="fill" className="text-emerald-500" />
      </div>
    </div>
  ),
};

// Export commonly used icons for easy access
export {
  Heart,
  Baby,
  Wind,
  Drop,
  Heartbeat,
  Bone,
  Flask,
  Flower,
  Pill,
  Syringe,
  FirstAid,
  Stethoscope,
  Thermometer,
  Bandaids,
  Brain,
  Eye,
  Ear,
  Tooth,
  HandHeart,
  Person,
  Wheelchair,
  Virus,
  Dna,
  Atom,
  Lightning,
  Moon,
  Sun,
  Warning,
  ShieldCheck,
  ShieldWarning,
  CheckCircle,
  XCircle,
  Info,
  Question,
  Camera,
  Image,
  MagnifyingGlass,
  Upload,
  Sparkle,
  Star,
  Pulse,
  ChartLine,
  ClipboardText,
  FileText,
  BookOpen,
  GraduationCap,
  Leaf,
  Coffee,
  Barbell,
  Bed,
  Clock,
  Calendar,
  Phone,
  DeviceMobile,
  Devices,
  CloudArrowUp,
  CloudCheck,
  UserCircle,
  Users,
  House,
  MapPin,
  Globe,
  Scales,
  Ruler,
  Timer,
  Hourglass,
};
