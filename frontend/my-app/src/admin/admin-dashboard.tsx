import React from 'react';
import { ShieldCheck, LogOut, Users, BookOpen, LayoutDashboard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Users', value: '1,284', icon: Users, color: '#6366f1' },
        { label: 'Active Courses', value: '42', icon: BookOpen, color: '#8b5cf6' },
        { label: 'Total Revenue', value: '$12,450', icon: ShieldCheck, color: '#10b981' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#080814',
            color: '#fff',
            fontFamily: "'Sora', sans-serif",
            display: 'flex'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap');
                .sidebar-item:hover { background: rgba(255,255,255,0.05); }
                .stat-card:hover { transform: translateY(-5px); border-color: rgba(99,102,241,0.3) !important; }
            `}</style>

            {/* Sidebar */}
            <div style={{
                width: 260,
                borderRight: '1px solid rgba(255,255,255,0.08)',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 32
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px' }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: 16
                    }}>A</div>
                    <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Outfit', sans-serif" }}>ADMIN PANEL</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', color: '#a78bfa', cursor: 'pointer' }}>
                        <LayoutDashboard size={18} />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Dashboard</span>
                    </div>
                    <div className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        <Users size={18} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>Users</span>
                    </div>
                    <div className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        <BookOpen size={18} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>Courses</span>
                    </div>
                    <div className="sidebar-item" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        <Settings size={18} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>Settings</span>
                    </div>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                            borderRadius: 12, border: 'none', background: 'rgba(239,68,68,0.1)',
                            color: '#f87171', cursor: 'pointer', fontSize: 14, fontWeight: 600
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '40px 60px' }}>
                <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit', sans-serif", margin: '0 0 8px' }}>Dashboard Overview</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Welcome back, super admin.</p>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-card" style={{
                            padding: 24, background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ 
                                width: 44, height: 44, borderRadius: 12, 
                                background: `${stat.color}15`, display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16, border: `1px solid ${stat.color}30`
                            }}>
                                <stat.icon size={22} color={stat.color} />
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: 4 }}>{stat.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div style={{
                    padding: 32, background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24
                }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>Recent Activity</h3>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                        Chart or Activity Feed Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
