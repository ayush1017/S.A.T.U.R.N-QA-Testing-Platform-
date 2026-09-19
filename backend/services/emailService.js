import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendFeedbackEmail({ feedback, submitter }) {
  const to = process.env.FEEDBACK_TO_EMAIL || process.env.SMTP_USER;

  if (!to) {
    throw new Error(
      'Feedback email is not configured. Set FEEDBACK_TO_EMAIL (and SMTP settings) in backend/.env',
    );
  }

  const transporter = createTransporter();
  if (!transporter) {
    throw new Error(
      'Email SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env',
    );
  }

  const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"SATURN QA Agent" <${from}>`,
    to,
    replyTo: submitter?.email || undefined,
    subject: `[SATURN Feedback] ${feedback.subject}`,
    text: [
      'New feedback received from SATURN',
      '',
      `Rating: ${feedback.rating}/5 (${stars})`,
      `Category: ${feedback.category}`,
      `Subject: ${feedback.subject}`,
      '',
      'Message:',
      feedback.message,
      '',
      '---',
      `Submitted by: ${submitter?.name || 'Unknown'} (@${submitter?.username || 'n/a'})`,
      `User email: ${submitter?.email || 'Not provided'}`,
      `Feedback ID: ${feedback._id}`,
      `Submitted at: ${new Date(feedback.createdAt).toLocaleString()}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b;">
        <h2 style="color: #4c6ef5; margin-bottom: 4px;">New SATURN Feedback</h2>
        <p style="color: #64748b; margin-top: 0;">A user submitted feedback through the app.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Rating</td>
            <td style="padding: 8px 0;">${feedback.rating}/5 ${stars}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Category</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${feedback.category}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Subject</td>
            <td style="padding: 8px 0;">${escapeHtml(feedback.subject)}</td>
          </tr>
        </table>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px; font-weight: bold;">Message</p>
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(feedback.message)}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 13px; color: #64748b; margin: 0;">
          Submitted by <strong>${escapeHtml(submitter?.name || 'Unknown')}</strong>
          (@${escapeHtml(submitter?.username || 'n/a')})<br />
          Email: ${escapeHtml(submitter?.email || 'Not provided')}<br />
          Feedback ID: ${feedback._id}<br />
          Time: ${new Date(feedback.createdAt).toLocaleString()}
        </p>
      </div>
    `,
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
