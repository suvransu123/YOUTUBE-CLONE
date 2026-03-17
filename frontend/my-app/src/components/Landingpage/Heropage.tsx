import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Brain, Zap, Users } from 'lucide-react';

const stats = [
  { value: '12,000+', label: 'Students Enrolled', icon: Users },
  { value: '50+', label: 'Expert Courses', icon: Brain },
  { value: '4.9★', label: 'Average Rating', icon: Sparkles },
  { value: '95%', label: 'Placement Rate', icon: Zap },
];

export default function Heropage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #080814 0%, #0f0a1e 50%, #080814 100%)',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '8%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px 60px', position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ maxWidth: 720 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 28,
            animation: 'fadeUp 0.6s ease both',
          }}>
            <Sparkles size={14} color="#a78bfa" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: '#a78bfa', fontWeight: 500 }}>
              AI-Powered Learning Platform
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 'clamp(42px, 7vw, 80px)', lineHeight: 1.1,
            color: '#fff', marginBottom: 24, letterSpacing: '-1.5px',
            animation: 'fadeUp 0.6s 0.1s ease both',
          }}>
            Master{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Artificial
            </span>
            <br />Intelligence
            <br />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300, fontSize: '0.65em', letterSpacing: '-0.5px' }}>
              with AiFinity Academy
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontFamily: "'Sora', sans-serif", fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 40,
            maxWidth: 560, animation: 'fadeUp 0.6s 0.2s ease both',
          }}>
            From beginner to expert — learn Machine Learning, Generative AI, Data Science and more with hands-on projects and industry mentors.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap',
            animation: 'fadeUp 0.6s 0.3s ease both',
          }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12, textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 15,
              boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(99,102,241,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)'; }}
            >
              Start Learning Free <ArrowRight size={16} />
            </Link>

            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 28px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff', fontFamily: "'Sora', sans-serif",
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={12} fill="#fff" color="#fff" style={{ marginLeft: 2 }} />
              </span>
              Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            marginTop: 48, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
            animation: 'fadeUp 0.6s 0.4s ease both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `hsl(${240 + i * 20},60%,${55 + i * 5}%)`,
                  border: '2px solid #080814',
                  marginLeft: i > 1 ? -8 : 0,
                  fontSize: 11, color: '#fff', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Joined by <strong style={{ color: '#a78bfa' }}>12,000+</strong> students worldwide
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          marginTop: 80, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, animation: 'fadeUp 0.6s 0.5s ease both',
        }}>
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '20px 24px',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <Icon size={20} color="#6366f1" style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}