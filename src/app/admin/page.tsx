'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Settings, 
  LogOut, 
  RefreshCw, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  ChevronDown,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { StudentSubmission } from '@/types';
import { Input } from '@/components/FormElements';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ username: '', password: '', exportedCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [exportLimit, setExportLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ 
          username: data.username, 
          password: '', 
          exportedCount: data.exportedCount || 0 
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      alert('Settings updated. Please log in again.');
      handleLogout();
    } else {
      alert('Update failed');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/export?limit=${exportLimit}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissions_${Date.now()}.xlsx`;
        a.click();
        fetchSettings();
      } else {
        const data = await response.json();
        alert(data.error || 'Export failed');
      }
    } catch (error) {
      alert('Export error');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const response = await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) fetchSubmissions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record permanently?')) return;
    const response = await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
    if (response.ok) fetchSubmissions();
  };

  useEffect(() => {
    fetchSubmissions();
    fetchSettings();
  }, []);

  const filteredSubmissions = submissions.filter(sub => 
    sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusInfo = (status: string = 'pending') => {
    switch (status) {
      case 'accepted': return { icon: <CheckCircle className="text-green-500" size={16} />, bg: 'bg-green-500/10', text: 'text-green-500' };
      case 'rejected': return { icon: <XCircle className="text-red-500" size={16} />, bg: 'bg-red-500/10', text: 'text-red-500' };
      case 'reviewed': return { icon: <RefreshCw className="text-blue-500" size={16} />, bg: 'bg-blue-500/10', text: 'text-blue-500' };
      default: return { icon: <Clock className="text-yellow-500" size={16} />, bg: 'bg-yellow-500/10', text: 'text-yellow-500' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Users size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl">Admin Dashboard</h1>
              <p className="text-xs text-white/40 uppercase tracking-tighter">Student Admission Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { fetchSettings(); setShowSettings(true); }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent transition-colors font-medium text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        
        {/* Stats & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 space-y-2">
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Total Applications</p>
              <h3 className="text-4xl font-bold">{submissions.length}</h3>
            </div>
            <div className="glass-panel p-6 space-y-2">
              <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Exported History</p>
              <h3 className="text-4xl font-bold">{settings.exportedCount}</h3>
            </div>
            <div className="glass-panel p-6 space-y-2 border-primary/20 bg-primary/5">
              <p className="text-primary/60 text-sm font-medium uppercase tracking-wider">New Pending</p>
              <h3 className="text-4xl font-bold">{submissions.filter(s => s.status === 'pending').length}</h3>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Export Limit</span>
              <input 
                type="number" 
                value={exportLimit} 
                onChange={e => setExportLimit(parseInt(e.target.value) || 1)}
                className="bg-white/10 w-16 text-center rounded-lg py-1 border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button 
              onClick={handleExport}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm"
            >
              <FileSpreadsheet size={16} /> Export Latest
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="glass-panel overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchSubmissions} className="btn-secondary px-4 py-2.5 text-sm flex items-center gap-2">
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] text-white/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-semibold">Applicant</th>
                  <th className="px-6 py-4 font-semibold">Course</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                   <tr><td colSpan={4} className="px-6 py-12 text-center text-white/20">Loading records...</td></tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-white/20">No matching records found.</td></tr>
                ) : filteredSubmissions.map((sub) => {
                  const status = getStatusInfo(sub.status);
                  return (
                    <motion.tr 
                      key={sub.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{sub.fullName}</span>
                          <span className="text-sm text-white/40">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-white/60">{sub.courseToLearn === 'Other' ? sub.courseToLearnOther : sub.courseToLearn}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                          {status.icon} {sub.status?.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                          >
                            <Eye size={18} />
                          </button>
                          <select 
                            value={sub.status || 'pending'}
                            onChange={(e) => handleStatusChange(sub.id!, e.target.value)}
                            className="bg-white/5 text-xs rounded-lg border-white/5 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="pending" className="bg-background">Pending</option>
                            <option value="reviewed" className="bg-background">Reviewed</option>
                            <option value="accepted" className="bg-background">Accepted</option>
                            <option value="rejected" className="bg-background">Rejected</option>
                          </select>
                          <button 
                            onClick={() => handleDelete(sub.id!)}
                            className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/20 text-red-500/60 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals (Portal implementations) */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Application Details</h2>
                <button onClick={() => setSelectedSubmission(null)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <DetailItem icon={<User />} label="Full Name" value={selectedSubmission.fullName} />
                  <DetailItem icon={<Mail />} label="Email" value={selectedSubmission.email} />
                  <DetailItem icon={<Phone />} label="Phone" value={selectedSubmission.phone} />
                  <DetailItem icon={<Calendar />} label="DOB" value={selectedSubmission.dob} />
                  <DetailItem icon={<MapPin />} label="Address" value={selectedSubmission.address} isLink />
                  <DetailItem icon={<GraduationCap />} label="Target Course" value={selectedSubmission.courseToLearn === 'Other' ? selectedSubmission.courseToLearnOther : selectedSubmission.courseToLearn} />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Academic Background</h4>
                  <div className="bg-white/5 rounded-2xl p-6 text-white/80 leading-relaxed whitespace-pre-wrap">
                    {selectedSubmission.educationHistory || "No detailed history provided."}
                  </div>
                </div>

                {selectedSubmission.educationDocument && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-xl text-primary"><FileSpreadsheet size={24} /></div>
                      <div>
                        <p className="font-bold text-white">Supporting Document</p>
                        <p className="text-sm text-white/40">{selectedSubmission.educationDocumentName || "Attachment"}</p>
                      </div>
                    </div>
                    <a 
                      href={selectedSubmission.educationDocument} 
                      download={selectedSubmission.educationDocumentName}
                      className="btn-primary py-2 px-6 text-sm"
                    >
                      Download
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel w-full max-w-md p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">System Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <Input 
                  label="New Admin Username" 
                  value={settings.username} 
                  onChange={e => setSettings({...settings, username: e.target.value})} 
                  required
                />
                <Input 
                  label="New Admin Password" 
                  type="password"
                  value={settings.password} 
                  onChange={e => setSettings({...settings, password: e.target.value})} 
                  required
                />
                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full">Update Credentials</button>
                  <p className="text-xs text-center text-white/20 mt-6 leading-relaxed">
                    Security Warning: Changing credentials will invalidate your current session. You will be redirected to the login page.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon, label, value, isLink = false }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
        {React.cloneElement(icon, { size: 14 })} {label}
      </div>
      {isLink && value?.startsWith('http') ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium block truncate">View Location Map</a>
      ) : (
        <div className="text-white font-medium truncate" title={value}>{value || "N/A"}</div>
      )}
    </div>
  );
}
