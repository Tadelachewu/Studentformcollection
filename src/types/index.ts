export interface StudentSubmission {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address: string;
  previousCourse: string;
  previousCourseOther?: string;
  courseToLearn: string;
  courseToLearnOther?: string;
  educationHistory: string;
  educationDocument?: string;
  educationDocumentName?: string;
  guardianName: string;
  guardianPhone: string;
  notes?: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt?: string;
}

export interface AdminSettings {
  username: string;
  password?: string;
  exportedCount?: number;
}
