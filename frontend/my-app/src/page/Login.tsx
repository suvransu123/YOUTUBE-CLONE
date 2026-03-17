import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, ChevronDown, User, ShieldCheck } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
  role: "user" | "admin";
};

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ defaultValues: { role: "user" } });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const selectedRole = watch("role");

  const onSubmit = async (data: LoginFormData) => {
    try {
      const endpoint = data.role === "admin" ? "/api/v1/admin/login" : "/api/v1/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setMessage({ text: result.message || "Login failed", type: "error" });
        return;
      }

      if (result.success) {
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate(selectedRole === "admin" ? "/admin/dashboard" : "/dashboard"), 1500);
      } else {
        setMessage({ text: result.message || "Invalid credentials", type: "error" });
      }
    } catch {
      setMessage({ text: "Server error. Please try again.", type: "error" });
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    fontFamily: "'Sora', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "rgba(255,255,255,0.45)", marginBottom: 7,
    letterSpacing: "0.07em", textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #080814 0%, #0f0a1e 50%, #080814 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", position: "relative", overflow: "hidden",
      fontFamily: "'Sora', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .login-input { border: 1px solid rgba(255,255,255,0.09); }
        .login-input:focus { border-color: rgba(99,102,241,0.6) !important; background: rgba(99,102,241,0.06) !important; }
        .login-input::placeholder { color: rgba(255,255,255,0.25); }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.55) !important; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .role-select option { background: #1a1a2e; color: #fff; }
        .eye-btn { 
          position: absolute; 
          right: 13px; 
          top: 50%; 
          transform: translateY(-50%);
          background: none; 
          border: none; 
          cursor: pointer; 
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
          line-height: 0;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7) !important; background: rgba(255,255,255,0.07); }
      `}</style>

      {/* Glow orbs */}
      <div style={{ position:"absolute", top:"10%", left:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter:"blur(50px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", right:"5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", filter:"blur(50px)", pointerEvents:"none" }} />

      {/* Floating shapes */}
      <div style={{ position:"absolute", top:"20%", right:"15%", width:80, height:80, borderRadius:20, border:"1px solid rgba(99,102,241,0.15)", transform:"rotate(15deg)", animation:"float 6s ease-in-out infinite", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"25%", left:"12%", width:50, height:50, borderRadius:12, border:"1px solid rgba(139,92,246,0.12)", transform:"rotate(-10deg)", animation:"float 8s ease-in-out infinite 2s", pointerEvents:"none" }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 440,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28, padding: "44px 40px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        animation: "fadeUp 0.5s ease both",
        position: "relative",
      }}>

        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 900, color: "#fff",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
              fontFamily: "'Outfit', sans-serif",
            }}>A</div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.5px" }}>
              AI<span style={{ color: "#a78bfa" }}>PREPNEXT</span>
              <span style={{ fontWeight: 300, fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>Academy</span>
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 100, padding: "4px 12px", marginBottom: 14,
          }}>
            <Sparkles size={12} color="#a78bfa" />
            <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600, letterSpacing: "0.05em" }}>WELCOME BACK</span>
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 28, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px",
          }}>Sign in to your account</h1>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            Continue your AI learning journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Role Dropdown */}
          <div>
            <label style={labelStyle}>Sign in as</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
                {selectedRole === "admin"
                  ? <ShieldCheck size={15} color="#a78bfa" />
                  : <User size={15} color="rgba(255,255,255,0.3)" />
                }
              </div>
              <select
                className="login-input role-select"
                style={{
                  ...inputBase,
                  border: `1px solid ${selectedRole === "admin" ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.09)"}`,
                  appearance: "none",
                  WebkitAppearance: "none",
                  paddingLeft: 40,
                  cursor: "pointer",
                  background: selectedRole === "admin" ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.04)",
                }}
                {...register("role")}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={14} color="rgba(255,255,255,0.3)" style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                type="email"
                placeholder="you@email.com"
                className="login-input"
                style={{
                  ...inputBase,
                  border: `1px solid ${errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"}`,
                }}
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(239,68,68,0.85)" }}>⚠ {errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            {/* ── Label only (no forgot password here) ── */}
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="login-input"
                style={{
                  ...inputBase,
                  padding: "12px 44px 12px 40px",
                  border: `1px solid ${errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"}`,
                }}
                {...register("password", { required: "Password is required" })}
              />
              {/* ── Eye toggle — perfectly centred in the right padding zone ── */}
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {errors.password && (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(239,68,68,0.85)" }}>⚠ {errors.password.message}</p>
            )}

            {/* ── Forgot password sits RIGHT BELOW the input ── */}
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <a
                href="#"
                style={{ fontSize: 12, color: "#818cf8", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")}
                onMouseLeave={e => (e.currentTarget.style.color = "#818cf8")}
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, fontSize: 13,
              background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${message.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              color: message.type === "success" ? "#34d399" : "#f87171",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {message.type === "success" ? "✓" : "⚠"} {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-btn"
            style={{
              width: "100%", padding: "13px", marginTop: 4,
              borderRadius: 12, border: "none", cursor: "pointer",
              background: selectedRole === "admin"
                ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 15,
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{
                  width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite", display: "inline-block",
                }} />
                Signing in...
              </>
            ) : (
              <>
                {selectedRole === "admin" ? <ShieldCheck size={16} /> : <ArrowRight size={16} />}
                {selectedRole === "admin" ? "Sign in as Admin" : "Sign In"}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: 13.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#818cf8", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={e => (e.currentTarget.style.color = "#818cf8")}
          >
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;