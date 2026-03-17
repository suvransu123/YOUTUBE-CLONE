import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Upload, ArrowRight, Sparkles, X, ShieldCheck } from "lucide-react";

type FormData = {
  user_name: string;
  email: string;
  password: string;
  phone: string;
  avatar: FileList;
  role: "user" | "admin";
  admin_key?: string;
};

function Registration() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { role: "user" } });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin">("user");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarName(file.name);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    setAvatarName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("user_name", data.user_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      formData.append("avatar", data.avatar[0]);
      formData.append("role", data.role);
      if (data.role === "admin" && data.admin_key) {
        formData.append("admin_key", data.admin_key);
      }

      const endpoint = data.role === "admin" ? "/api/v1/admin/register" : "/api/v1/register";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage({ text: result.message || "Registration failed", type: "error" });
        return;
      }

      setMessage({ text: "Account created! Redirecting to login...", type: "success" });
      reset();
      clearAvatar();
      setRole("user");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setMessage({ text: "Server error. Please try again.", type: "error" });
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.09)"}`,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    fontFamily: "'Sora', sans-serif",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 7,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
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
        .reg-input:focus { border-color: rgba(99,102,241,0.6) !important; background: rgba(99,102,241,0.06) !important; }
        .reg-input::placeholder { color: rgba(255,255,255,0.25); }
        .reg-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.55) !important; }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .upload-zone:hover { border-color: rgba(99,102,241,0.5) !important; background: rgba(99,102,241,0.06) !important; }
        .role-card:hover { border-color: rgba(99,102,241,0.4) !important; background: rgba(99,102,241,0.07) !important; }
      `}</style>

      {/* Glow orbs */}
      <div style={{ position:"absolute", top:"8%", right:"5%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)", filter:"blur(50px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"8%", left:"5%", width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter:"blur(50px)", pointerEvents:"none" }} />

      {/* Floating shapes */}
      <div style={{ position:"absolute", top:"15%", left:"8%", width:70, height:70, borderRadius:18, border:"1px solid rgba(99,102,241,0.12)", transform:"rotate(15deg)", animation:"float 7s ease-in-out infinite", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"20%", right:"10%", width:48, height:48, borderRadius:12, border:"1px solid rgba(139,92,246,0.1)", transform:"rotate(-10deg)", animation:"float 9s ease-in-out infinite 1s", pointerEvents:"none" }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 480,
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
          position:"absolute", top:0, left:"10%", right:"10%", height:1,
          background:"linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }} />

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Link to="/" style={{ textDecoration:"none", display:"inline-flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            <div style={{
              width:50, height:50, borderRadius:15,
              background:"linear-gradient(135deg, #6366f1, #8b5cf6)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:21, fontWeight:900, color:"#fff",
              boxShadow:"0 8px 24px rgba(99,102,241,0.4)",
              fontFamily:"'Outfit', sans-serif",
            }}>A</div>
            <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:800, fontSize:19, color:"#fff", letterSpacing:"-0.5px" }}>
              AI<span style={{ color:"#a78bfa" }}>PREPNEXT</span>
              <span style={{ fontWeight:300, fontSize:12, color:"rgba(255,255,255,0.35)", marginLeft:4 }}>Academy</span>
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)",
            borderRadius:100, padding:"4px 12px", marginBottom:12,
          }}>
            <Sparkles size={12} color="#a78bfa" />
            <span style={{ fontSize:11, color:"#a78bfa", fontWeight:600, letterSpacing:"0.05em" }}>JOIN FOR FREE</span>
          </div>
          <h1 style={{
            fontFamily:"'Outfit', sans-serif", fontWeight:800,
            fontSize:26, color:"#fff", margin:"0 0 6px", letterSpacing:"-0.5px",
          }}>Create your account</h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", margin:0 }}>
            Start your AI learning journey today
          </p>
        </div>

        {/* ── Role Selector ── */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Register As</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(["user", "admin"] as const).map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  className="role-card"
                  onClick={() => { setRole(r); setValue("role", r); }}
                  style={{
                    padding: "13px 10px",
                    borderRadius: 12,
                    border: `1px solid ${active ? "rgba(99,102,241,0.65)" : "rgba(255,255,255,0.09)"}`,
                    background: active ? "rgba(99,102,241,0.13)" : "rgba(255,255,255,0.03)",
                    color: active ? "#a78bfa" : "rgba(255,255,255,0.38)",
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    boxShadow: active ? "0 0 0 1px rgba(99,102,241,0.25) inset" : "none",
                  }}
                >
                  {r === "user"
                    ? <User size={14} color={active ? "#a78bfa" : "rgba(255,255,255,0.3)"} />
                    : <ShieldCheck size={14} color={active ? "#a78bfa" : "rgba(255,255,255,0.3)"} />
                  }
                  {r === "user" ? "User" : "Admin"}
                  {active && (
                    <span style={{
                      marginLeft: 4, fontSize: 10, background: "rgba(99,102,241,0.25)",
                      borderRadius: 100, padding: "1px 7px", color: "#c4b5fd",
                    }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input type="hidden" {...register("role")} />

          {/* Username + Phone row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Username</label>
              <div style={{ position:"relative" }}>
                <User size={15} color="rgba(255,255,255,0.3)" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <input
                  placeholder="john_doe"
                  className="reg-input"
                  style={inputStyle(!!errors.user_name)}
                  {...register("user_name", { required: "Required" })}
                  onFocus={e => { e.target.style.borderColor="rgba(99,102,241,0.6)"; e.target.style.background="rgba(99,102,241,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor=errors.user_name?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.09)"; e.target.style.background="rgba(255,255,255,0.04)"; }}
                />
              </div>
              {errors.user_name && <p style={{ margin:"5px 0 0", fontSize:11, color:"rgba(239,68,68,0.85)" }}>⚠ {errors.user_name.message}</p>}
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <div style={{ position:"relative" }}>
                <Phone size={15} color="rgba(255,255,255,0.3)" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <input
                  placeholder="+91 98765..."
                  className="reg-input"
                  style={inputStyle(!!errors.phone)}
                  {...register("phone", { required: "Required" })}
                  onFocus={e => { e.target.style.borderColor="rgba(99,102,241,0.6)"; e.target.style.background="rgba(99,102,241,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor=errors.phone?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.09)"; e.target.style.background="rgba(255,255,255,0.04)"; }}
                />
              </div>
              {errors.phone && <p style={{ margin:"5px 0 0", fontSize:11, color:"rgba(239,68,68,0.85)" }}>⚠ {errors.phone.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position:"relative" }}>
              <Mail size={15} color="rgba(255,255,255,0.3)" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
              <input
                type="email" placeholder="you@email.com"
                className="reg-input"
                style={inputStyle(!!errors.email)}
                {...register("email", { required: "Email is required" })}
                onFocus={e => { e.target.style.borderColor="rgba(99,102,241,0.6)"; e.target.style.background="rgba(99,102,241,0.06)"; }}
                onBlur={e => { e.target.style.borderColor=errors.email?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.09)"; e.target.style.background="rgba(255,255,255,0.04)"; }}
              />
            </div>
            {errors.email && <p style={{ margin:"5px 0 0", fontSize:11, color:"rgba(239,68,68,0.85)" }}>⚠ {errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position:"relative" }}>
              <Lock size={15} color="rgba(255,255,255,0.3)" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="reg-input"
                style={{ ...inputStyle(!!errors.password), paddingRight:44 }}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                onFocus={e => { e.target.style.borderColor="rgba(99,102,241,0.6)"; e.target.style.background="rgba(99,102,241,0.06)"; }}
                onBlur={e => { e.target.style.borderColor=errors.password?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.09)"; e.target.style.background="rgba(255,255,255,0.04)"; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position:"absolute", right:13, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", display:"flex", padding:0,
              }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p style={{ margin:"5px 0 0", fontSize:11, color:"rgba(239,68,68,0.85)" }}>⚠ {errors.password.message}</p>}
          </div>

          {/* ── Admin Secret Key (only when role === "admin") ── */}
          {role === "admin" && (
            <div style={{ animation: "fadeUp 0.3s ease both" }}>
              <label style={labelStyle}>Admin Secret Key</label>
              <div style={{ position: "relative" }}>
                <ShieldCheck size={15} color="rgba(255,255,255,0.3)" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <input
                  placeholder="Enter your admin key"
                  className="reg-input"
                  style={{
                    ...inputStyle(!!errors.admin_key),
                    borderColor: errors.admin_key ? "rgba(239,68,68,0.5)" : "rgba(99,102,241,0.25)",
                    background: "rgba(99,102,241,0.04)",
                  }}
                  {...register("admin_key", {
                    required: role === "admin" ? "Admin key is required" : false,
                  })}
                  onFocus={e => { e.target.style.borderColor="rgba(99,102,241,0.6)"; e.target.style.background="rgba(99,102,241,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor=errors.admin_key?"rgba(239,68,68,0.5)":"rgba(99,102,241,0.25)"; e.target.style.background="rgba(99,102,241,0.04)"; }}
                />
              </div>
              {errors.admin_key && <p style={{ margin:"5px 0 0", fontSize:11, color:"rgba(239,68,68,0.85)" }}>⚠ {errors.admin_key.message}</p>}
            </div>
          )}

          {/* Avatar Upload */}
          <div>
            <label style={labelStyle}>Profile Photo</label>
            {avatarPreview ? (
              <div style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"12px 16px", borderRadius:12,
                background:"rgba(99,102,241,0.06)",
                border:"1px solid rgba(99,102,241,0.3)",
              }}>
                <img src={avatarPreview} alt="Avatar preview" style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(99,102,241,0.4)" }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:"#fff", fontWeight:600, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{avatarName}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Photo selected</div>
                </div>
                <button type="button" onClick={clearAvatar} style={{
                  background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)",
                  borderRadius:8, padding:"5px", cursor:"pointer", color:"#f87171", display:"flex",
                }}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label className="upload-zone" style={{
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                gap:8, padding:"20px", borderRadius:12, cursor:"pointer",
                border:"1.5px dashed rgba(255,255,255,0.12)",
                background:"rgba(255,255,255,0.02)",
                transition:"border-color 0.2s, background 0.2s",
              }}>
                <div style={{
                  width:38, height:38, borderRadius:10,
                  background:"rgba(99,102,241,0.12)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Upload size={18} color="#818cf8" />
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontWeight:600 }}>Click to upload photo</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:2 }}>PNG, JPG, WEBP up to 5MB</div>
                </div>
                <input
                  type="file" accept="image/*"
                  style={{ display:"none" }}
                  {...register("avatar", { required: "Profile photo is required" })}
                  onChange={(e) => {
                    handleAvatarChange(e);
                    register("avatar").onChange(e);
                  }}
                  ref={(e) => {
                    register("avatar").ref(e);
                    (fileInputRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                  }}
                />
              </label>
            )}
            {errors.avatar && <p style={{ margin:"5px 0 0", fontSize:11, color:"rgba(239,68,68,0.85)" }}>⚠ {errors.avatar.message as string}</p>}
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding:"12px 16px", borderRadius:10, fontSize:13,
              background: message.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border:`1px solid ${message.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              color: message.type === "success" ? "#34d399" : "#f87171",
              display:"flex", alignItems:"center", gap:8,
            }}>
              {message.type === "success" ? "✓" : "⚠"} {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="reg-btn"
            style={{
              width:"100%", padding:"13px", marginTop:4,
              borderRadius:12, border:"none", cursor:"pointer",
              background: role === "admin"
                ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color:"#fff", fontFamily:"'Sora', sans-serif",
              fontWeight:700, fontSize:15,
              boxShadow:"0 8px 24px rgba(99,102,241,0.35)",
              transition:"transform 0.2s, box-shadow 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{
                  width:16, height:16, border:"2px solid rgba(255,255,255,0.3)",
                  borderTopColor:"#fff", borderRadius:"50%",
                  animation:"spin 0.8s linear infinite", display:"inline-block",
                }} />
                Creating Account...
              </>
            ) : (
              <>
                {role === "admin" ? <ShieldCheck size={16} /> : <ArrowRight size={16} />}
                {role === "admin" ? "Create Admin Account" : "Create Account"}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>or</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
        </div>

        <p style={{ textAlign:"center", fontSize:13.5, color:"rgba(255,255,255,0.4)", margin:0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color:"#818cf8", fontWeight:600, textDecoration:"none" }}
            onMouseEnter={e => (e.currentTarget.style.color="#a78bfa")}
            onMouseLeave={e => (e.currentTarget.style.color="#818cf8")}
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;