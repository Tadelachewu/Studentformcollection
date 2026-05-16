export interface StudentSubmission {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address: string;
  course: string;
  educationHistory: string;
  guardianName: string;
  guardianPhone: string;
  notes?: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt?: string;
}
