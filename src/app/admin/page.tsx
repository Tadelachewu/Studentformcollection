'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { StudentSubmission } from '@/types';
import { Input } from '@/components/FormElements';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ username: '', password: '', exportedCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [exportLimit, setExportLimit] = useState(10);
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
    if (!settings.username || !settings.password) {
      alert('Username and password are required');
      return;
    }

    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      alert('Settings updated successfully. Please log in again.');
      handleLogout();
    } else {
      alert('Failed to update settings');
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
        a.download = `submissions_export_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        fetchSettings(); // Update the local exported count display
      } else {
        const data = await response.json();
        alert(data.error || 'Export failed');
      }
    } catch (error) {
      alert('An error occurred during export');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        fetchSubmissions();
      } else if (response.status === 401) {
        router.push('/admin/login');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSubmissions();
      } else if (response.status === 401) {
        router.push('/admin/login');
      } else {
        alert('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchSettings();
  }, []);

  const getStatusClass = (status: string = 'pending') => {
    return styles[status] || styles.pending;
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={fetchSubmissions} style={{ width: 'auto' }}>
            Refresh
          </button>
          <button 
            className="btn-primary" 
            onClick={() => { fetchSettings(); setShowSettings(true); }} 
            style={{ width: 'auto', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            Settings
          </button>
          <button 
            className="btn-primary" 
            onClick={handleLogout} 
            style={{ width: 'auto', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statValue}>{submissions.length}</div>
          <div className={styles.statLabel}>Total Applications</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statValue}>{settings.exportedCount || 0}</div>
          <div className={styles.statLabel}>Already Exported</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Limit:</span>
            <input 
              type="number" 
              value={exportLimit} 
              onChange={e => setExportLimit(parseInt(e.target.value) || 1)}
              style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}
            />
          </div>
          <button className="btn-primary" onClick={handleExport} style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}>
            Export New Records
          </button>
        </div>
      </div>

      <div className={`glass-panel ${styles.tableContainer}`}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>No applications received yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Course To Learn</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.fullName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sub.email}</div>
                  </td>
                  <td>{sub.courseToLearn === 'Other' ? sub.courseToLearnOther : sub.courseToLearn}</td>
                  <td>{new Date(sub.createdAt || '').toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(sub.status)}`}>
                      {sub.status || 'Pending'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      Details
                    </button>
                    <select 
                      className={styles.actionSelect}
                      value={sub.status || 'pending'}
                      onChange={(e) => handleStatusChange(sub.id!, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', backgroundColor: '#dc2626' }}
                      onClick={() => handleDeleteSubmission(sub.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
          <div className={`glass-panel ${styles.modal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Application Details</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedSubmission(null)}>&times;</button>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Full Name</div>
                <div className={styles.detailValue}>{selectedSubmission.fullName}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Email</div>
                <div className={styles.detailValue}>{selectedSubmission.email}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Phone</div>
                <div className={styles.detailValue}>{selectedSubmission.phone}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Date of Birth</div>
                <div className={styles.detailValue}>{selectedSubmission.dob}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Gender</div>
                <div className={styles.detailValue}>{selectedSubmission.gender}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Address</div>
                <div className={styles.detailValue}>{selectedSubmission.address}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Previous Course</div>
                <div className={styles.detailValue}>{selectedSubmission.previousCourse === 'Other' ? selectedSubmission.previousCourseOther : selectedSubmission.previousCourse}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Course to Learn</div>
                <div className={styles.detailValue}>{selectedSubmission.courseToLearn === 'Other' ? selectedSubmission.courseToLearnOther : selectedSubmission.courseToLearn}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Guardian Name</div>
                <div className={styles.detailValue}>{selectedSubmission.guardianName || 'N/A'}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>Guardian Phone</div>
                <div className={styles.detailValue}>{selectedSubmission.guardianPhone || 'N/A'}</div>
              </div>
              
              <div className={styles.fullWidthDetail}>
                <div className={styles.detailLabel}>Previous Education History</div>
                <div className={styles.detailValue} style={{ whiteSpace: 'pre-wrap' }}>{selectedSubmission.educationHistory || 'No history provided.'}</div>
              </div>

              {selectedSubmission.educationDocument && (
                <div className={styles.fullWidthDetail}>
                  <div className={styles.detailLabel}>Education Document</div>
                  <div className={styles.detailValue}>
                    <a href={selectedSubmission.educationDocument} download={selectedSubmission.educationDocumentName || 'document'} className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '8px 16px', fontSize: '0.85rem', marginTop: '10px' }}>
                      Download Attachment: {selectedSubmission.educationDocumentName}
                    </a>
                  </div>
                </div>
              )}

              <div className={styles.fullWidthDetail}>
                <div className={styles.detailLabel}>Additional Notes</div>
                <div className={styles.detailValue} style={{ whiteSpace: 'pre-wrap' }}>{selectedSubmission.notes || 'No notes provided.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div className={`glass-panel ${styles.modal}`} style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Admin Settings</h2>
              <button className={styles.closeBtn} onClick={() => setShowSettings(false)}>&times;</button>
            </div>
            <form onSubmit={handleUpdateSettings}>
              <div style={{ marginBottom: '15px' }}>
                <Input 
                  label="New Admin Username" 
                  value={settings.username} 
                  onChange={e => setSettings({...settings, username: e.target.value})} 
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Input 
                  label="New Admin Password" 
                  type="password"
                  value={settings.password} 
                  onChange={e => setSettings({...settings, password: e.target.value})} 
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Update Credentials</button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '15px', textAlign: 'center' }}>
                Changing credentials will log you out immediately.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
