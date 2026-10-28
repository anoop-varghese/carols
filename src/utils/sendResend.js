// Utility to send an email via Resend API
// Usage: import sendResend from '../utils/sendResend';
// await sendResend({ to, subject, html, from });

export default async function sendResend({ to, subject, html, from }) {
  const key = process.env.REACT_APP_RESEND_API_KEY;
  if (!key) {
    throw new Error('Missing REACT_APP_RESEND_API_KEY environment variable');
  }

  const payload = {
    from: from || `no-reply@${typeof window !== 'undefined' ? window.location.hostname : 'example.com'}`,
    to,
    subject,
    html,
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API error (${res.status}): ${text}`);
  }

  return res.json();
}
