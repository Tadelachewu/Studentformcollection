'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Input, Select, TextArea } from '@/components/FormElements';

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    previousCourse: '',
    previousCourseOther: '',
    courseToLearn: '',
    courseToLearnOther: '',
    educationHistory: '',
    educationDocument: '',
    educationDocumentName: '',
    guardianName: '',
    guardianPhone: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.previousCourse) newErrors.previousCourse = 'Previous course is required';
    if (formData.previousCourse === 'Other' && !formData.previousCourseOther) newErrors.previousCourseOther = 'Please specify your previous course';
    if (!formData.courseToLearn) newErrors.courseToLearn = 'Course to learn is required';
    if (formData.courseToLearn === 'Other' && !formData.courseToLearnOther) newErrors.courseToLearnOther = 'Please specify the course you want to learn';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setIsSuccess(true);
    } catch (error) {
      alert('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          educationDocument: reader.result as string,
          educationDocumentName: file.name
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, educationDocument: '', educationDocumentName: '' }));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
          setFormData(prev => ({ ...prev, address: mapsLink }));
        },
        () => {
          alert("Unable to retrieve your location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  if (isSuccess) {
    return (
      <main className={styles.container}>
        <div className={`glass-panel animate-fade-in ${styles.successMessage}`}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Application Submitted!</h2>
          <p className={styles.successDesc}>
            Thank you, {formData.fullName}. Your application has been received successfully. 
            We have sent a confirmation email to {formData.email}.
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Submit Another Application
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Student Admission Portal</h1>
        <p className={styles.subtitle}>Apply now for the upcoming academic year.</p>
      </div>

      <div className={`glass-panel animate-fade-in ${styles.formContainer}`}>
        <form onSubmit={handleSubmit} className={styles.grid}>
          {/* Personal Information */}
          <div className={styles.fullWidth}>
            <h3>Personal Information</h3>
            <hr style={{ margin: '10px 0 20px', borderColor: 'var(--border)' }} />
          </div>

          <Input label="Full Name *" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="John Doe" />
          <Input label="Email Address *" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" />
          <Input label="Phone Number *" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+1 234 567 890" />
          <Input label="Date of Birth *" type="date" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} />
          
          <Select 
            label="Gender *" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            error={errors.gender}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
              { value: 'Prefer not to say', label: 'Prefer not to say' }
            ]} 
          />
          <div className={styles.fullWidth}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label" style={{ marginBottom: '8px' }}>Home Address (Text or Location Link)</label>
              <button 
                type="button" 
                onClick={handleGetLocation}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Get Current Location
              </button>
            </div>
            <textarea className="input-field" rows={3} name="address" value={formData.address} onChange={handleChange} placeholder="Full street address or Google Maps link..." />
          </div>

          {/* Academic Information */}
          <div className={styles.fullWidth} style={{ marginTop: '20px' }}>
            <h3>Academic Information</h3>
            <hr style={{ margin: '10px 0 20px', borderColor: 'var(--border)' }} />
          </div>

          <div className={styles.fullWidth}>
            <Select 
              label="Previous Academics/Course *" 
              name="previousCourse" 
              value={formData.previousCourse} 
              onChange={handleChange} 
              error={errors.previousCourse}
              options={[
                { value: 'Computer Science', label: 'Computer Science' },
                { value: 'Business Administration', label: 'Business Administration' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Arts & Design', label: 'Arts & Design' },
                { value: 'Other', label: 'Other' }
              ]} 
            />
            {formData.previousCourse === 'Other' && (
              <div style={{ marginTop: '10px' }}>
                <Input label="Please Specify Previous Course *" name="previousCourseOther" value={formData.previousCourseOther} onChange={handleChange} error={errors.previousCourseOther} placeholder="E.g., Psychology" />
              </div>
            )}
          </div>

          <div className={styles.fullWidth} style={{ marginTop: '20px' }}>
            <Select 
              label="What do you want to learn? *" 
              name="courseToLearn" 
              value={formData.courseToLearn} 
              onChange={handleChange} 
              error={errors.courseToLearn}
              options={[
                { value: 'Web Development', label: 'Web Development' },
                { value: 'Mobile App Development', label: 'Mobile App Development' },
                { value: 'Basic Programming', label: 'Basic Programming' },
                { value: 'Automation', label: 'Automation' },
                { value: 'AI Powered Development', label: 'AI Powered Development' },
                { value: 'Other', label: 'Other' }
              ]} 
            />
            {formData.courseToLearn === 'Other' && (
              <div style={{ marginTop: '10px' }}>
                <Input label="Please Specify Course To Learn *" name="courseToLearnOther" value={formData.courseToLearnOther} onChange={handleChange} error={errors.courseToLearnOther} placeholder="E.g., Data Science" />
              </div>
            )}
          </div>
          <div className={styles.fullWidth}>
            <TextArea label="Previous Education History (Optional if document provided)" name="educationHistory" value={formData.educationHistory} onChange={handleChange} placeholder="High school, previous degrees, etc." />
            <div style={{ marginTop: '10px' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Or Upload Education Document</label>
              <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="input-field" style={{ padding: '8px' }} />
              {formData.educationDocumentName && <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--secondary)' }}>Selected: {formData.educationDocumentName}</p>}
            </div>
          </div>

          {/* Guardian Information */}
          <div className={styles.fullWidth} style={{ marginTop: '20px' }}>
            <h3>Parent / Guardian Information</h3>
            <hr style={{ margin: '10px 0 20px', borderColor: 'var(--border)' }} />
          </div>

          <Input label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Jane Doe" />
          <Input label="Guardian Phone" type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="+1 234 567 890" />

          <div className={styles.fullWidth} style={{ marginTop: '20px' }}>
            <TextArea label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any other information you'd like us to know..." />
          </div>

          <div className={styles.fullWidth}>
            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
