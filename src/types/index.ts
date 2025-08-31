export interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
  important: boolean;
  author: string;
  tags: string[];
}

export interface Schedule {
  id: number;
  day: string;
  timeSlot: string;
  level: string;
  instructor: string;
  price: number;
  description: string;
  active: boolean;
}

export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  grade: string;
  bio: string;
  photo: string;
  experience: number;
  specialty: string;
  active: boolean;
}

export interface Photo {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
  alt: string;
  active: boolean;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'competition' | 'stage' | 'meeting' | 'demonstration';
  description: string;
  location: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface Registration {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  parentName?: string;
  parentEmail?: string;
  experience: string;
  medicalCertificate: boolean;
  newsletter: boolean;
}