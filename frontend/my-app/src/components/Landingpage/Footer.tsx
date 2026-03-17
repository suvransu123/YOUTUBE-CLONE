
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  'Courses': ['Machine Learning', 'Generative AI', 'Data Science', 'Deep Learning', 'Python for AI'],
  'Company': ['About Us', 'Our Team', 'Careers', 'Blog', 'Press Kit'],
  'Support': ['Help Center', 'Contact Us', 'Refund Policy', 'Privacy Policy', 'Terms of Service'],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{
      background: '#05050f',
      borderTop: '1px solid rgba(99,102,241,0.1)',
      padding: '64px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top: Brand + Newsletter + Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 48, marginBottom: 56,
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 900, color: '#fff',
              }}>A</div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff' }}>
                AI<span style={{ color: '#a78bfa' }}>FINITY</span>
              </span>
            </div>
            <p style={{
              fontFamily: "'Sora', sans-serif", fontSize: 13.5,
              color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, marginBottom: 24,
            }}>
              Empowering the next generation of AI professionals through world-class education.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  textDecoration: 'none',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(99,102,241,0.4)';
                    el.style.color = '#a78bfa';
                    el.style.background = 'rgba(99,102,241,0.1)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.color = 'rgba(255,255,255,0.4)';
                    el.style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Link Groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
                color: '#fff', marginBottom: 18, letterSpacing: '0.03em',
              }}>{group}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      fontFamily: "'Sora', sans-serif", fontSize: 13.5,
                      color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#a78bfa'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
              color: '#fff', marginBottom: 10,
            }}>Stay Updated</h4>
            <p style={{
              fontFamily: "'Sora', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.7, marginBottom: 16,
            }}>
              Get the latest AI trends and course updates in your inbox.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email" placeholder="your@email.com"
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontFamily: "'Sora', sans-serif", fontSize: 13,
                  outline: 'none', minWidth: 0,
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center',
              }}>
                <ArrowRight size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <Mail size={12} color="rgba(255,255,255,0.25)" />
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                No spam, unsubscribe anytime.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 24,
          display: 'flex', flexWrap: 'wrap', gap: 12,
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} AiFinity Academy. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{
                fontFamily: "'Sora', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.25)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}