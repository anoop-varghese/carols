import React, { useState } from 'react';
import sendResend from '../utils/sendResend';

export default function ContactDev() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const devEmail = process.env.REACT_APP_DEV_EMAIL || 'dev@example.com';

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSending(true);
    const subject = `Site message from ${name || email || 'visitor'}`;
    const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr/><div>${escapeHtml(message).replace(/\n/g, '<br/>')}</div>`;
    try {
      await sendResend({ to: devEmail, subject, html });
      setStatus({ ok: true, msg: 'Message sent — thank you!' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus({ ok: false, msg: err.message || 'Failed to send message' });
    } finally {
      setSending(false);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return (
    <section className="contact-dev" style={{ marginTop: 18 }}>
      <h3 style={{ margin: '0 0 8px' }}>Message the developer</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
          />
          <input
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, padding: '8px 10px' }}
            type="email"
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <textarea
            placeholder="Message to developer"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '8px 10px' }}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send Message'}
          </button>
          {status && (
            <div style={{ color: status.ok ? '#9fd5b8' : '#ffb4b4' }}>{status.msg}</div>
          )}
        </div>
      </form>
    </section>
  );
}
