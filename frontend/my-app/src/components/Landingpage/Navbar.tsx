import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Courses', href: '#courses' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map(l => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    const onTop = () => { if (window.scrollY < 80) setActive('home'); };
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener('scroll', onTop);
    };
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
  };

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(8,8,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : 'none',
      }}
    >
      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#fff',
          }}>A</div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.5px' }}>
            AI<span style={{ color: '#a78bfa' }}>FINITY</span>
            <span style={{ fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>Academy</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = active === link.href.replace('#', '');
            return (
              <button key={link.href} onClick={() => scrollTo(link.href)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 16px', borderRadius: 8, position: 'relative',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 14,
                transition: 'color 0.2s',
              }}>
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                    width: '60%', height: 2, borderRadius: 2,
                    background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="desktop-nav">
          <Link to="/login" style={{
            padding: '8px 20px', borderRadius: 8, textDecoration: 'none',
            color: 'rgba(255,255,255,0.7)', fontFamily: "'Sora', sans-serif",
            fontWeight: 500, fontSize: 14, transition: 'color 0.2s',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>Sign In</Link>
          <Link to="/register" style={{
            padding: '8px 20px', borderRadius: 8, textDecoration: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontFamily: "'Sora', sans-serif",
            fontWeight: 600, fontSize: 14, boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
          }}>Get Started</Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} style={{
          display: 'none', background: 'none', border: 'none',
          color: '#fff', cursor: 'pointer', padding: 4,
        }} className="mobile-toggle">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: 'rgba(8,8,20,0.98)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(99,102,241,0.15)',
          padding: '20px 24px 24px',
        }}>
          {navLinks.map(link => (
            <button key={link.href} onClick={() => scrollTo(link.href)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              color: active === link.href.replace('#', '') ? '#a78bfa' : 'rgba(255,255,255,0.7)',
              fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 16,
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>{link.label}</button>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Link to="/login" style={{
              flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none',
              color: '#fff', fontFamily: "'Sora', sans-serif", fontWeight: 500, fontSize: 14,
            }}>Sign In</Link>
            <Link to="/register" style={{
              flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              textDecoration: 'none', color: '#fff',
              fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14,
            }}>Get Started</Link>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}