import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'hello@aifinityacademy.com', sub: 'We reply within 24 hours' },
  { icon: Phone, label: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Sat, 9am–6pm IST' },
  { icon: MapPin, label: 'Visit Us', value: 'Hyderabad, Telangana', sub: 'HITEC City, 500081' },
  { icon: Clock, label: 'Support Hours', value: '9am – 6pm IST', sub: 'Monday to Saturday' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontFamily: "'Sora', sans-serif", fontSize: 14,
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontFamily: "'Sora', sans-serif",
    fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
    marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' as const,
  };

  return (
    <section id="contact" style={{
      background: 'linear-gradient(180deg, #080814 0%, #0d0b1e 100%)',
      padding: '100px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            fontFamily: "'Sora', sans-serif", fontSize: 12, color: '#a78bfa', fontWeight: 500,
          }}>
            <MessageCircle size={13} /> Get In Touch
          </span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff',
            letterSpacing: '-1px', marginBottom: 20, lineHeight: 1.15,
          }}>
            Have questions?{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              We'd love to help
            </span>
          </h2>
          <p style={{
            fontFamily: "'Sora', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.45)',
            maxWidth: 500, margin: '0 auto', lineHeight: 1.8,
          }}>
            Reach out to our team for course enquiries, corporate training, or just to say hello.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>

          {/* Contact Info */}
          <div>
            <div style={{ marginBottom: 32 }}>
              {contactInfo.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(99,102,241,0.12)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="#818cf8" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 2 }}>{value}</div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(99,102,241,0.15)',
              background: 'rgba(99,102,241,0.04)',
              height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8,
            }}>
              <MapPin size={28} color="#6366f1" />
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                HITEC City, Hyderabad, Telangana 500081
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24, padding: '36px 32px',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>Message Sent!</h3>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{
                  marginTop: 24, padding: '10px 24px', borderRadius: 10,
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#a78bfa', fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 28 }}>
                  Send us a message
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input
                      style={inputStyle} placeholder="Rahul Sharma" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      style={inputStyle} type="email" placeholder="you@email.com" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Subject</label>
                  <input
                    style={inputStyle} placeholder="Course enquiry / General question" required
                    value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
                    placeholder="Tell us how we can help you..." required
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '13px', borderRadius: 10,
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: '#fff',
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.35)',
                  transition: 'all 0.2s',
                }}>
                  {loading ? (
                    <>
                      <span style={{
                        width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', display: 'inline-block',
                      }} />
                      Sending...
                    </>
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}