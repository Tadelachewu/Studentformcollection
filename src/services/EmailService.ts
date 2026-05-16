import nodemailer from 'nodemailer';
import { StudentSubmission } from '@/types';

export interface EmailAdapter {
  sendConfirmationEmail(submission: StudentSubmission): Promise<boolean>;
  sendAdminNotification(submission: StudentSubmission): Promise<boolean>;
}

export class NodemailerEmailAdapter implements EmailAdapter {
  private transporter;
  private fromEmail: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  }

  private generateSubmissionHtml(submission: StudentSubmission): string {
    const fields = [
      { label: 'Application ID', value: submission.id },
      { label: 'Full Name', value: submission.fullName },
      { label: 'Email', value: submission.email },
      { label: 'Phone', value: submission.phone },
      { label: 'DOB', value: submission.dob },
      { label: 'Gender', value: submission.gender },
      { label: 'Address', value: submission.address },
      { label: 'Previous Course', value: submission.previousCourse === 'Other' ? submission.previousCourseOther : submission.previousCourse },
      { label: 'Course to Learn', value: submission.courseToLearn === 'Other' ? submission.courseToLearnOther : submission.courseToLearn },
      { label: 'Education History', value: submission.educationHistory },
      { label: 'Education Document', value: submission.educationDocumentName ? 'Attached (Check Admin Dashboard)' : 'None' },
      { label: 'Guardian Name', value: submission.guardianName || 'N/A' },
      { label: 'Guardian Phone', value: submission.guardianPhone || 'N/A' },
      { label: 'Notes', value: submission.notes || 'None' },
      { label: 'Status', value: submission.status },
      { label: 'Submitted At', value: submission.createdAt },
    ];

    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">Application Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${fields.map(f => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">${f.label}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${f.value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }

  async sendConfirmationEmail(submission: StudentSubmission): Promise<boolean> {
    try {
      const summaryHtml = this.generateSubmissionHtml(submission);
      await this.transporter.sendMail({
        from: `"Student Portal" <${this.fromEmail}>`,
        to: submission.email,
        subject: "Application Received - Student Portal",
        html: `
          <h2>Hello ${submission.fullName},</h2>
          <p>Your application has been received successfully. Below is a copy of the data you provided:</p>
          ${summaryHtml}
          <p style="margin-top: 20px;">We will review your application and get back to you shortly.</p>
        `,
      });
      console.log(`[EMAIL] Confirmation email sent to ${submission.email}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL ERROR] Failed to send confirmation to ${submission.email}:`, error);
      return false;
    }
  }

  async sendAdminNotification(submission: StudentSubmission): Promise<boolean> {
    try {
      const summaryHtml = this.generateSubmissionHtml(submission);
      await this.transporter.sendMail({
        from: `"Student Portal" <${this.fromEmail}>`,
        to: this.fromEmail,
        subject: `New Application: ${submission.fullName}`,
        html: `
          <h2>New Student Application Received</h2>
          <p>A new application has been submitted. Details are below:</p>
          ${summaryHtml}
          <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a></p>
        `,
      });
      console.log(`[EMAIL] Admin notification sent for ${submission.id}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL ERROR] Failed to send admin notification:`, error);
      return false;
    }
  }
}

class EmailService {
  private adapter: EmailAdapter;

  constructor() {
    this.adapter = new NodemailerEmailAdapter();
  }

  async sendConfirmationEmail(submission: StudentSubmission) {
    return this.adapter.sendConfirmationEmail(submission);
  }

  async sendAdminNotification(submission: StudentSubmission) {
    return this.adapter.sendAdminNotification(submission);
  }
}

export const emailService = new EmailService();

