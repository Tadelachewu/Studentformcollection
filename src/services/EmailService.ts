export interface EmailAdapter {
  sendConfirmationEmail(to: string, name: string): Promise<boolean>;
  sendAdminNotification(submissionId: string, name: string): Promise<boolean>;
}

export class MockEmailAdapter implements EmailAdapter {
  async sendConfirmationEmail(to: string, name: string): Promise<boolean> {
    console.log(`[EMAIL MOCK] Sending confirmation email to ${to} for student ${name}`);
    return true;
  }

  async sendAdminNotification(submissionId: string, name: string): Promise<boolean> {
    console.log(`[EMAIL MOCK] Sending admin notification for new submission ${submissionId} (${name})`);
    return true;
  }
}

class EmailService {
  private adapter: EmailAdapter;

  constructor() {
    // We could switch this based on env vars to use SendGrid/AWS SES/etc.
    this.adapter = new MockEmailAdapter();
  }

  async sendConfirmationEmail(to: string, name: string) {
    return this.adapter.sendConfirmationEmail(to, name);
  }

  async sendAdminNotification(submissionId: string, name: string) {
    return this.adapter.sendAdminNotification(submissionId, name);
  }
}

export const emailService = new EmailService();
