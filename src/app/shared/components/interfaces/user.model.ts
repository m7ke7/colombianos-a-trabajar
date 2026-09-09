export type UserRole = 'CANDIDATE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface CandidateProfile extends User {
  role: 'CANDIDATE';
  phone?: string;
  resumeUrl?: string;
  preferredCities?: string[];
}

export interface AdminProfile extends User {
  role: 'ADMIN';
  permissions: string[]; // ej. ['manage_users', 'manage_jobs', 'kraz_approval']
}