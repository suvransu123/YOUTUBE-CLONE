import { Target, Eye, Heart, Award, BookOpen, Users, TrendingUp, Shield } from 'lucide-react';

const values = [
  { icon: Target, title: 'Mission-Driven', desc: 'Democratizing AI education for everyone, everywhere — regardless of background.' },
  { icon: Eye, title: 'Future-Focused', desc: 'Our curriculum evolves with the industry so your skills stay relevant tomorrow.' },
  { icon: Heart, title: 'Student-First', desc: 'Every decision we make starts with one question: does this help our students succeed?' },
  { icon: Shield, title: 'Industry-Verified', desc: 'All content is reviewed and taught by practitioners working in top AI companies.' },
];

const milestones = [
  { icon: Users, number: '12,000+', label: 'Students Enrolled' },
  { icon: BookOpen, number: '50+', label: 'Courses Available' },
  { icon: TrendingUp, number: '95%', label: 'Career Placement' },
  { icon: Award, number: '30+', label: 'Industry Partners' },
];

const team = [
  { name: 'Dr. Aryan Mehta', role: 'Founder & CEO', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', initials: 'AM' },
  { name: 'Priya Sharma', role: 'Head of Curriculum', bg: 'linear-gradient(135deg, #0ea5e9, #6366f1)', initials: 'PS' },
  { name: 'Rahul Verma', role: 'Lead AI Instructor', bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)', initials: 'RV' },
  { name: 'Sneha Kapoor', role: 'Student Success Lead', bg: 'linear-gradient(135deg, #10b981, #0ea5e9)', initials: 'SK' },
];

export default function About() {
  return (
    <section id="about" style={{
      background: 'linear-gradient(180deg, #080814 0%, #0d0b1e 50%, #080814 100%)',
      padding: '100px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 100, padding: '5px 14px', marginBottom: 20,
            fontFamily: "'Sora', sans-serif", fontSize: 12, color: '#a78bfa', fontWeight: 500,
          }}>
            About AiFinity Academy
          </span>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff',
            letterSpacing: '-1px', marginBottom: 20, lineHeight: 1.15,
          }}>
            We're building the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              future of AI learning
            </span>
          </h2>
          <p style={{
            fontFamily: "'Sora', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.5)',
            maxWidth: 580, margin: '0 auto', lineHeight: 1.8,
          }}>
            AiFinity Academy was founded with one belief: world-class AI education should be accessible to every ambitious mind in India and beyond.
          </p>
        </div>

        {/* Story Block */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 40, marginBottom: 80, alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 700,
              fontSize: 28, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px',
            }}>Our Story</h3>
            <p style={{
              fontFamily: "'Sora', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.85, marginBottom: 16,
            }}>
              Founded in 2022, AiFinity Academy emerged from a simple frustration — AI courses were either too theoretical or too expensive. Our team of engineers, researchers and educators set out to change that.
            </p>
            <p style={{
              fontFamily: "'Sora', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.85,
            }}>
              Today we serve thousands of students across India with live workshops, self-paced courses, and real-world projects guided by mentors from Google, Microsoft, and leading startups.
            </p>
          </div>

          {/* Visual accent */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: 24, padding: 32,
            }}>
              {milestones.map(({ icon: Icon, number, label }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={20} color="#818cf8" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff' }}>{number}</div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 80 }}>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: 28, color: '#fff', marginBottom: 32, textAlign: 'center', letterSpacing: '-0.5px',
          }}>Our Core Values</h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20,
          }}>
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '28px 24px',
                transition: 'border-color 0.3s, background 0.3s, transform 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(99,102,241,0.35)';
                  el.style.background = 'rgba(99,102,241,0.05)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.02)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Icon size={22} color="#a78bfa" />
                </div>
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 8 }}>{title}</h4>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: 28, color: '#fff', marginBottom: 32, textAlign: 'center', letterSpacing: '-0.5px',
          }}>Meet the Team</h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20,
          }}>
            {team.map(({ name, role, bg, initials }) => (
              <div key={name} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '28px 20px', textAlign: 'center',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(99,102,241,0.35)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: bg, margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: '#fff',
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                }}>{initials}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, color: '#a78bfa' }}>{role}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}