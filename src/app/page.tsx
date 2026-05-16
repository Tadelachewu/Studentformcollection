'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Select, TextArea } from '@/components/FormElements';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  CheckCircle2,
  UploadCloud,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Music,
  Send,
  Share2,
  Video,
  Globe,
  Code
} from 'lucide-react';

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

      if (!response.ok) throw new Error('Failed to submit application');
      setIsSuccess(true);
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData(prev => ({ ...prev, address: `https://www.google.com/maps?q=${lat},${lng}` }));
        },
        () => alert("Unable to retrieve location.")
      );
    }
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 scroll-smooth grid-bg">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 relative z-20">
        <div className="text-white font-bold text-2xl tracking-tighter uppercase flex items-center gap-3">
          <div className="relative w-12 h-12 overflow-hidden rounded-2xl shadow-lg shadow-primary/20">
            <Image 
              src="/logo.svg" 
              alt="Tech Academic Logo" 
              fill
              className="object-cover"
            />
          </div>
          <span className="flex items-center">
            <span className="text-white">TECH</span>
            <span className="text-[#D8B4FE] ml-2">ACADEMIC</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#apply" className="hover:text-white transition-colors">Apply</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Profile Component */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">Tadele Mesfin</div>
            <div className="text-xs text-white/40">Portal Administrator</div>
          </div>
          <div className="relative w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden cursor-pointer hover:border-primary transition-all">
            <img
              src="/profile-avatar.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>

      {/* Background Elements */}
      <div className="mesh-bg">
        <div className="blob top-[-10%] left-[-10%] opacity-50" />
        <div className="blob bottom-[-10%] right-[-10%] opacity-30 animate-delay-2000" />
        <div className="blob top-[40%] left-[60%] opacity-20 animation-delay-4000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-32">
        {/* Hero Section */}
        <section id="home" className="max-w-4xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                {/* Header / Landing Page Section */}
                <div className="text-left space-y-2 mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 font-medium tracking-widest uppercase text-sm"
                  >
                    Tech Academic Portal
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-black tracking-tight text-white sm:text-8xl leading-none"
                  >
                    Admission Portal
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-light text-white/40 tracking-tight"
                  >
                    Creative Application Process
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-white/60 max-w-xl mt-6 leading-relaxed"
                  >
                    Begin your journey with us today. Our streamlined digital application ensures a seamless transition into your academic future.
                  </motion.p>
                </div>

                {/* Form Section */}
                <section id="apply" className="space-y-8 pt-20">
                  <div className="text-center space-y-4 mb-10">
                    <h2 className="text-4xl font-bold text-white">Ready to Join Us?</h2>
                    <p className="text-white/50">Fill out the application form below to get started.</p>
                  </div>
                  <div className="glass-panel p-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-10">

                      {/* Section: Personal */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary border-b border-white/5 pb-4">
                          <User size={20} />
                          <h3 className="text-xl font-semibold text-white">Personal Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium text-white/70">Home Address</label>
                              <button type="button" onClick={handleGetLocation} className="text-xs text-primary hover:underline flex items-center gap-1">
                                <MapPin size={12} /> Get Location
                              </button>
                            </div>
                            <input className="input-field" name="address" value={formData.address} onChange={handleChange} placeholder="Street address or link..." />
                          </div>
                        </div>
                      </div>

                      {/* Section: Academic */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary border-b border-white/5 pb-4">
                          <BookOpen size={20} />
                          <h3 className="text-xl font-semibold text-white">Academic Interest</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                              label="Previous Academics *"
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
                              <Input label="Specify Previous Course *" name="previousCourseOther" value={formData.previousCourseOther} onChange={handleChange} error={errors.previousCourseOther} />
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                              label="Course to Learn *"
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
                              <Input label="Specify Course to Learn *" name="courseToLearnOther" value={formData.courseToLearnOther} onChange={handleChange} error={errors.courseToLearnOther} />
                            )}
                          </div>

                          <TextArea label="Education History" name="educationHistory" value={formData.educationHistory} onChange={handleChange} placeholder="Briefly describe your previous education..." />

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                              <FileText size={16} /> Support Document
                            </label>
                            <div className="relative group">
                              <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                <UploadCloud className="text-white/40 group-hover:text-primary transition-colors" size={32} />
                                <span className="text-sm text-white/40">{formData.educationDocumentName || "Click or drag to upload certificate"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section: Guardian */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary border-b border-white/5 pb-4">
                          <Users size={20} />
                          <h3 className="text-xl font-semibold text-white">Guardian Contact</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Full Name" />
                          <Input label="Guardian Phone" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="+1 234..." />
                        </div>
                      </div>

                      <TextArea label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Anything else you want to share?" />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 shadow-xl shadow-primary/20 hover:shadow-primary/30"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Submit Application <ChevronRight size={20} /></>
                        )}
                      </button>
                    </form>
                  </div>
                </section>

                {/* About Section */}
                <section id="about" className="pt-20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                      <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest">
                        Our Mission
                      </div>
                      <h2 className="text-5xl font-bold text-white leading-tight">
                        Mastering the Future of <span className="text-primary italic">Technology</span>
                      </h2>
                      <p className="text-xl text-white/50 leading-relaxed">
                        Tech Academic is a premier institution dedicated to bridging the gap between theoretical knowledge and practical industry skills. We provide students with a high-tech environment to grow as world-class engineers and innovators.
                      </p>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <div className="text-4xl font-black text-white">5000+</div>
                          <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Students Joined</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-4xl font-black text-white">98%</div>
                          <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Success Rate</div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                      <div className="glass-panel p-4 relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group cursor-pointer overflow-hidden">
                          <img
                            src="/profile-avatar.png"
                            alt="Tech Academic Team"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-125 transition-all">
                              <ChevronRight size={32} className="text-white ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="pt-20 pb-32">
                  <div className="glass-panel p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
                        <p className="text-white/50">Have questions? Reach out to me directly through any of these platforms.</p>
                        <div className="flex gap-4">
                          <a href="https://github.com/Tadelachewu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all" title="GitHub">
                            <Code size={18} />
                          </a>
                          <a href="https://www.tiktok.com/@coming_to_hacker" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all" title="TikTok">
                            <Music size={18} />
                          </a>
                          <a href="https://t.me/TadeleMesfin" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all" title="Telegram">
                            <Send size={18} />
                          </a>
                          <a href="https://www.youtube.com/@EagleTube-ph6wh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all" title="YouTube">
                            <Video size={18} />
                          </a>
                          <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all" title="Website">
                            <Globe size={18} />
                          </a>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Mail size={20} />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Email Me</div>
                            <div className="text-white/40 text-sm">tade2024bdu@gmail.com</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Phone size={20} />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Call Me</div>
                            <div className="text-white/40 text-sm">0949847581</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-white font-semibold mb-4">Quick Support</div>
                        <button className="w-full btn-secondary flex items-center justify-center gap-2">
                          <MessageSquare size={18} /> Live Chat
                        </button>
                        <button className="w-full btn-secondary flex items-center justify-center gap-2">
                          <ExternalLink size={18} /> Help Center
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-20 text-center text-white/20 text-sm border-t border-white/5 pt-10">
                    &copy; 2026 Tech Academic Systems. All rights reserved.
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 text-center space-y-6 max-w-xl mx-auto"
              >
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 text-green-500 mb-4">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-3xl font-bold text-white">Application Received!</h2>
                <p className="text-white/60 leading-relaxed">
                  Thank you for applying, <span className="text-white font-medium">{formData.fullName}</span>.
                  We've sent a confirmation email to <span className="text-white font-medium">{formData.email}</span>.
                  Our team will review your application and get back to you shortly.
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary w-full"
                  >
                    Return to Portal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
