import { useEffect, useState } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type User = {
  _id: string;
  user_name: string;
  email: string;
  phone: string;
  avatar?: string; // uploaded image path returned from server e.g. /uploads/filename.jpg
};

// ─────────────────────────────────────────────
// UTILITY — getInitials
// Returns first 2 chars of name uppercased.
// Used as fallback when no avatar image exists.
// ─────────────────────────────────────────────
function getInitials(name: string): string {
  return name?.slice(0, 2).toUpperCase() || "??";
}

// ─────────────────────────────────────────────
// UTILITY — getAvatarColor
// Deterministically picks a color from a palette
// based on the last char of the user's _id.
// Ensures the same user always gets the same color.
// ─────────────────────────────────────────────
function getAvatarColor(id: string): string {
  const colors = ["#6C63FF", "#FF6584", "#43D9AD", "#FFB347", "#4FC3F7", "#CE93D8"];
  const index = id?.charCodeAt(id.length - 1) % colors.length || 0;
  return colors[index];
}

// ─────────────────────────────────────────────
// AVATAR COMPONENT
// Renders the user's uploaded profile image.
// Falls back to a colored circle with initials if:
//   • avatar field is missing / null / empty string
//   • the image URL is broken or returns 404
// Props:
//   user     — User object (reads avatar + _id + user_name)
//   size     — circle diameter in px  (default 38)
//   fontSize — initials font size px  (default 13)
// ─────────────────────────────────────────────
function Avatar({
  user,
  size = 38,
  fontSize = 13,
}: {
  user: User;
  size?: number;
  fontSize?: number;
}) {
  // imgError becomes true when <img> fires onError
  // (broken URL, 403, 404, server down, etc.)
  const [imgError, setImgError] = useState(false);

  // Shared wrapper style — same shape/size for both image and initials
  const wrapStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize,
    color: "#fff",
    // Only apply the color background when falling back to initials
    background:
      user.avatar && !imgError ? "transparent" : getAvatarColor(user._id),
    // Ring visible in the modal hero (harmless in table)
    boxShadow: size >= 60 ? "0 0 0 4px rgba(255,255,255,0.08)" : "none",
  };

  // ── Show uploaded image ──
  if (user.avatar && !imgError) {
    return (
      <div style={wrapStyle}>
        <img
          src={user.avatar}          // relative path (/uploads/…) or full URL
          alt={user.user_name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImgError(true)} // graceful fallback on broken image
        />
      </div>
    );
  }

  // ── Fallback: colored initials ──
  return <div style={wrapStyle}>{getInitials(user.user_name)}</div>;
}

// ─────────────────────────────────────────────
// USER PROFILE MODAL
// Slide-in side panel showing full user details.
// Props:
//   user    — selected User (null = panel closed)
//   onClose — callback to close the panel
// ─────────────────────────────────────────────
function UserProfileModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  // Render nothing when no user is selected
  if (!user) return null;

  return (
    <>
      {/* Dimmed backdrop — click anywhere outside to close */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="profile-panel">

        {/* ── Top bar ── */}
        <div className="profile-header">
          <button className="close-btn" onClick={onClose} aria-label="Close profile">
            ✕
          </button>
          <div className="profile-title">User Profile</div>
        </div>

        {/* ── Hero: avatar + name + ID + status ── */}
        <div className="profile-hero">
          {/*
           * Avatar component — shows the user's uploaded photo (large, 76px).
           * Automatically falls back to initials if avatar is missing/broken.
           */}
          <Avatar user={user} size={76} fontSize={26} />

          <div className="profile-name">{user.user_name}</div>

          {/* Short reference ID — last 8 chars of MongoDB _id */}
          <div className="profile-uid">ID #{user._id.slice(-8).toUpperCase()}</div>

          {/* Active status badge */}
          <span className="status-dot">Active</span>
        </div>

        {/* ── Detail fields ── */}
        <div className="profile-fields">

          {/* Email */}
          <div className="profile-field">
            <div className="field-label">📧  Email Address</div>
            <div className="field-value">{user.email}</div>
          </div>

          {/* Phone */}
          <div className="profile-field">
            <div className="field-label">📞  Phone Number</div>
            <div className="field-value">{user.phone}</div>
          </div>

          {/* Avatar URL — shows the stored path for reference */}
          <div className="profile-field">
            <div className="field-label">🖼  Profile Image</div>
            <div className="field-value field-mono">
              {user.avatar || "No image uploaded"}
            </div>
          </div>

          {/* Full MongoDB _id — useful for admin / debugging */}
          <div className="profile-field">
            <div className="field-label">🗄  Database ID</div>
            <div className="field-value field-mono">{user._id}</div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="profile-actions">
          {/* Wire onClick to your own edit flow */}
          <button className="action-btn action-primary">✎  Edit User</button>
          {/* Wire onClick to your delete API */}
          <button className="action-btn action-danger">⊗  Delete User</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD COMPONENT
// Fetches users from /api/v1/dashboard,
// renders a searchable table, and opens
// the profile modal on row click.
// ─────────────────────────────────────────────
function Dashboard() {
  // Full user list from the API
  const [users, setUsers] = useState<User[]>([]);

  // True while the fetch request is in-flight
  const [loading, setLoading] = useState(true);

  // Non-empty = an error occurred during fetch
  const [error, setError] = useState("");

  // Controlled value of the search input
  const [search, setSearch] = useState("");

  // User whose row was clicked (null = modal closed)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ── Fetch users on mount ───────────────────
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/v1/dashboard");

        // Handle HTTP error responses (4xx / 5xx)
        if (!res.ok) {
          setError("Failed to load users.");
          return;
        }

        const data = await res.json();

        if (data.success) {
          // Support both { users: [] } and { data: [] } response shapes
          setUsers(data.users || data.data || []);
        } else {
          setError("Failed to load users.");
        }
      } catch (err) {
        // Network failure or JSON parse error
        console.error("Dashboard fetch error:", err);
        setError("Server error. Could not fetch users.");
      } finally {
        // Always clear the spinner whether fetch succeeded or failed
        setLoading(false);
      }
    };

    getUsers();
  }, []); // Empty deps — runs once on mount only

  // ── Search filter ──────────────────────────
  // Matches against username, email, and phone.
  // Case-insensitive for text fields.
  const filtered = users.filter(
    (u) =>
      u.user_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  // ── Render ─────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #09090B;
          font-family: 'Manrope', sans-serif;
          color: #FAFAFA;
          min-height: 100vh;
        }

        .db-wrap {
          min-height: 100vh;
          background: #09090B;
          background-image:
            radial-gradient(ellipse 55% 45% at 75% 5%, rgba(108,99,255,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 35% 35% at 5% 90%, rgba(67,217,173,0.08) 0%, transparent 55%);
        }

        /* ── TOP BAR ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .brand {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.3px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .brand-dot {
          width: 9px; height: 9px;
          background: #6C63FF;
          border-radius: 50%;
          box-shadow: 0 0 10px #6C63FF;
        }
        .topbar-right { display: flex; align-items: center; gap: 14px; }

        /* ── SEARCH ── */
        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 14px;
          transition: border-color 0.2s;
        }
        .search-box:focus-within { border-color: rgba(108,99,255,0.5); }
        .search-icon { font-size: 14px; color: rgba(255,255,255,0.3); }
        .search-box input {
          background: none; border: none; outline: none;
          font-family: 'Manrope', sans-serif;
          font-size: 13px; color: #FAFAFA; width: 200px;
        }
        .search-box input::placeholder { color: rgba(255,255,255,0.25); }
        .badge-count {
          background: rgba(108,99,255,0.18);
          border: 1px solid rgba(108,99,255,0.3);
          color: #A89BFF;
          font-size: 12px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px;
        }

        /* ── PAGE BODY ── */
        .page-body { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
        .page-header { margin-bottom: 36px; }
        .page-header h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 34px;
          letter-spacing: -1px; color: #fff; line-height: 1.1;
        }
        .page-header p {
          margin-top: 8px; font-size: 14px;
          color: rgba(250,250,250,0.4); font-weight: 400;
        }

        /* ── SUMMARY CARDS ── */
        .summary-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 32px;
        }
        .summary-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 22px 24px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .summary-card:hover { border-color: rgba(108,99,255,0.3); transform: translateY(-2px); }
        .summary-icon {
          width: 46px; height: 46px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .icon-purple { background: rgba(108,99,255,0.15); }
        .icon-green  { background: rgba(67,217,173,0.12); }
        .icon-pink   { background: rgba(255,101,132,0.12); }
        .summary-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 28px; color: #fff; line-height: 1;
        }
        .summary-lbl {
          font-size: 12px; color: rgba(250,250,250,0.4);
          margin-top: 3px; letter-spacing: 0.05em;
          text-transform: uppercase; font-weight: 500;
        }

        /* ── TABLE PANEL ── */
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; overflow: hidden;
        }
        .panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .panel-head-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 16px; color: #fff;
        }
        .panel-head-sub { font-size: 12px; color: rgba(250,250,250,0.35); margin-top: 2px; }

        /* ── TABLE ── */
        .user-table { width: 100%; border-collapse: collapse; }
        .user-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .user-table th {
          padding: 13px 28px; text-align: left;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(250,250,250,0.3);
        }
        .user-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          cursor: pointer; /* row is clickable */
        }
        .user-table tbody tr:last-child { border-bottom: none; }
        .user-table tbody tr:hover { background: rgba(108,99,255,0.07); }
        .user-table td {
          padding: 16px 28px; font-size: 14px;
          color: rgba(250,250,250,0.8); vertical-align: middle;
        }

        /* ── USER CELL ── */
        .user-cell { display: flex; align-items: center; gap: 12px; }
        .user-name { font-weight: 600; color: #fff; font-size: 14px; }
        .user-id { font-size: 11px; color: rgba(250,250,250,0.3); margin-top: 1px; }

        /* ── STATUS BADGE ── */
        .status-dot {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; color: #43D9AD;
          background: rgba(67,217,173,0.1);
          border: 1px solid rgba(67,217,173,0.2);
          padding: 3px 10px; border-radius: 20px; font-weight: 600;
        }
        .status-dot::before {
          content: ''; width: 6px; height: 6px;
          background: #43D9AD; border-radius: 50%; display: inline-block;
        }

        /* ── STATES ── */
        .state-box {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 72px 24px; gap: 12px;
          color: rgba(250,250,250,0.3); text-align: center;
        }
        .state-icon { font-size: 36px; opacity: 0.4; }
        .state-title { font-size: 16px; font-weight: 600; color: rgba(250,250,250,0.5); }
        .spinner {
          width: 32px; height: 32px;
          border: 3px solid rgba(108,99,255,0.2);
          border-top-color: #6C63FF;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-msg { color: #FF6584; font-size: 13px; }
        .no-results {
          padding: 40px 28px; text-align: center;
          color: rgba(250,250,250,0.25); font-size: 14px;
        }

        /* ── PROFILE MODAL ── */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }
        .profile-panel {
          position: fixed; top: 0; right: 0;
          width: 360px; height: 100vh;
          background: #111113;
          border-left: 1px solid rgba(255,255,255,0.08);
          z-index: 101;
          display: flex; flex-direction: column;
          animation: slideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          overflow-y: auto;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .profile-header {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .close-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          width: 32px; height: 32px; border-radius: 8px;
          cursor: pointer; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .profile-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 16px; color: #fff;
        }
        .profile-hero {
          display: flex; flex-direction: column; align-items: center;
          padding: 36px 24px 28px; gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .profile-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 20px; color: #fff;
        }
        .profile-uid {
          font-size: 12px; color: rgba(250,250,250,0.3);
          font-family: 'Manrope', sans-serif; margin-bottom: 4px;
        }
        .profile-fields {
          display: flex; flex-direction: column;
          gap: 2px; padding: 20px 24px; flex: 1;
        }
        .profile-field {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 14px 16px; margin-bottom: 8px;
        }
        .field-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.08em; color: rgba(250,250,250,0.35);
          font-weight: 600; margin-bottom: 6px;
        }
        .field-value {
          font-size: 14px; color: #fff;
          font-weight: 500; word-break: break-all;
        }
        .field-mono {
          font-family: 'Courier New', monospace;
          font-size: 12px; color: rgba(250,250,250,0.6);
        }
        .profile-actions {
          padding: 20px 24px; display: flex;
          flex-direction: column; gap: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .action-btn {
          width: 100%; padding: 12px; border-radius: 10px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; border: none;
          transition: opacity 0.15s, transform 0.1s;
        }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .action-primary { background: #6C63FF; color: #fff; }
        .action-danger {
          background: rgba(255,101,132,0.12);
          border: 1px solid rgba(255,101,132,0.25) !important;
          color: #FF6584;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 720px) {
          .topbar { padding: 0 20px; }
          .search-box input { width: 130px; }
          .page-body { padding: 24px 16px; }
          .summary-row { grid-template-columns: 1fr; }
          .user-table th:nth-child(3),
          .user-table td:nth-child(3) { display: none; }
          .profile-panel { width: 100%; }
        }
      `}</style>

      <div className="db-wrap">

        {/* ── TOP BAR ── */}
        <div className="topbar">
          <div className="brand">
            <span className="brand-dot" />
            Nexus
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="badge-count">{users.length} Users</div>
            <button 
              onClick={() => {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ── PAGE BODY ── */}
        <div className="page-body">
          <div className="page-header">
            <h1>User Dashboard</h1>
            <p>Manage and view all registered users. Click any row to view a profile.</p>
          </div>

          {/* ── SUMMARY CARDS ── */}
          <div className="summary-row">
            {/* Total users fetched from DB */}
            <div className="summary-card">
              <div className="summary-icon icon-purple">👥</div>
              <div>
                <div className="summary-val">{users.length}</div>
                <div className="summary-lbl">Total Users</div>
              </div>
            </div>
            {/* Active — all users treated as active for now */}
            <div className="summary-card">
              <div className="summary-icon icon-green">✦</div>
              <div>
                <div className="summary-val">{users.length}</div>
                <div className="summary-lbl">Active</div>
              </div>
            </div>
            {/* Shown — count after search filter applied */}
            <div className="summary-card">
              <div className="summary-icon icon-pink">⬡</div>
              <div>
                <div className="summary-val">{filtered.length}</div>
                <div className="summary-lbl">Shown</div>
              </div>
            </div>
          </div>

          {/* ── TABLE PANEL ── */}
          <div className="panel">
            <div className="panel-head">
              <div>
                <div className="panel-head-title">Registered Users</div>
                <div className="panel-head-sub">
                  Live data from /api/v1/dashboard — click a row to open profile
                </div>
              </div>
            </div>

            {loading ? (
              /* Spinner while API call is in-flight */
              <div className="state-box">
                <div className="spinner" />
                <div className="state-title">Loading users…</div>
              </div>
            ) : error ? (
              /* Error state */
              <div className="state-box">
                <div className="state-icon">⚠</div>
                <div className="state-title">Something went wrong</div>
                <div className="error-msg">{error}</div>
              </div>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    /* No search matches */
                    <tr>
                      <td colSpan={4}>
                        <div className="no-results">No users match your search.</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => (
                      /*
                       * Clicking a row sets selectedUser → opens profile modal.
                       * Avatar component handles image vs initials automatically.
                       */
                      <tr
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        title={`View profile for ${user.user_name}`}
                      >
                        <td>
                          <div className="user-cell">
                            {/* Small avatar (38px) — shows photo or initials */}
                            <Avatar user={user} size={38} fontSize={13} />
                            <div>
                              <div className="user-name">{user.user_name}</div>
                              {/* Short ID reference — last 6 chars of _id */}
                              <div className="user-id">#{user._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td><span className="status-dot">Active</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/*
       * Profile modal — rendered at root level so it overlays everything.
       * Passes selectedUser (null = hidden) and close handler.
       */}
      <UserProfileModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}

export default Dashboard;