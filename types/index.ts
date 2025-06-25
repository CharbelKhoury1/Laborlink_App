export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  userType: 'worker' | 'client';
  verified: boolean;
  createdAt: Date;
  language: 'en' | 'ar';
}

export interface WorkerProfile extends User {
  userType: 'worker';
  skills: Skill[];
  workHistory: WorkHistory[];
  ratings: Rating[];
  availability: Availability[];
  serviceRadius: number; // in kilometers
  hourlyRate: number;
  dailyRate: number;
  location: Location;
  idVerified: boolean;
  insuranceVerified: boolean;
  languages: ('arabic' | 'english' | 'french')[];
}

export interface ClientProfile extends User {
  userType: 'client';
  companyName?: string;
  location: Location;
  jobsPosted: number;
  averageRating: number;
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  location: Location;
  requiredSkills: string[];
  duration: number; // in hours
  budget: {
    min: number;
    max: number;
    currency: 'LBP' | 'USD';
  };
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  photos?: string[];
  createdAt: Date;
  scheduledDate?: Date;
  assignedWorkerId?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  experience: 'beginner' | 'intermediate' | 'expert';
  verified: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  region: string;
}

export interface WorkHistory {
  id: string;
  jobId: string;
  clientName: string;
  description: string;
  completedAt: Date;
  rating: number;
  review?: string;
  photos?: string[];
}

export interface Rating {
  id: string;
  fromUserId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

export interface Availability {
  dayOfWeek: number; // 0 = Sunday
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  available: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'location';
}

export interface Conversation {
  id: string;
  participants: string[];
  jobId?: string;
  lastMessage?: Message;
  createdAt: Date;
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number;
  currency: 'LBP' | 'USD';
  status: 'pending' | 'held' | 'released' | 'disputed' | 'refunded';
  createdAt: Date;
  releasedAt?: Date;
}