import { useEffect, useState } from "react";

type User = {
  _id: string;
  user_name: string;
  email: string;
  phone: string;
};

function getInitials(name: string) {
  return name?.slice(0, 2).toUpperCase() || "??";
}

function getAvatarColor(id: string) {
  const colors = ["#6C63FF", "#FF6584", "#43D9AD", "#FFB347", "#4FC3F7", "#CE93D8"];
  const index = id?.charCodeAt(id.length - 1) % colors.length || 0;
  return colors[index];
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/vite/user-dashboard");
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError("Failed to load users.");
        }
      } catch {
        setError("Server error. Could not fetch users.");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.user_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

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

        /* TOP BAR */
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

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

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
          background: none;
          border: none;
          outline: none;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          color: #FAFAFA;
          width: 200px;
        }
        .search-box input::placeholder { color: rgba(255,255,255,0.25); }

        .badge-count {
          background: rgba(108,99,255,0.18);
          border: 1px solid rgba(108,99,255,0.3);
          color: #A89BFF;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
        }

        /* PAGE BODY */
        .page-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        /* HEADER ROW */
        .page-header {
          margin-bottom: 36px;
        }
        .page-header h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 34px;
          letter-spacing: -1px;
          color: #fff;
          line-height: 1.1;
        }
        .page-header p {
          margin-top: 8px;
          font-size: 14px;
          color: rgba(250,250,250,0.4);
          font-weight: 400;
        }

        /* SUMMARY CARDS */
        .summary-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .summary-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .summary-card:hover {
          border-color: rgba(108,99,255,0.3);
          transform: translateY(-2px);
        }
        .summary-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .icon-purple { background: rgba(108,99,255,0.15); }
        .icon-green  { background: rgba(67,217,173,0.12); }
        .icon-pink   { background: rgba(255,101,132,0.12); }
        .summary-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: #fff;
          line-height: 1;
        }
        .summary-lbl {
          font-size: 12px;
          color: rgba(250,250,250,0.4);
          margin-top: 3px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* TABLE PANEL */
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
        }

        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .panel-head-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
        }
        .panel-head-sub {
          font-size: 12px;
          color: rgba(250,250,250,0.35);
          margin-top: 2px;
        }

        /* TABLE */
        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        .user-table thead tr {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .user-table th {
          padding: 13px 28px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(250,250,250,0.3);
        }
        .user-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .user-table tbody tr:last-child { border-bottom: none; }
        .user-table tbody tr:hover { background: rgba(255,255,255,0.03); }
        .user-table td {
          padding: 16px 28px;
          font-size: 14px;
          color: rgba(250,250,250,0.8);
          vertical-align: middle;
        }

        /* USER CELL */
        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0;
        }
        .user-name {
          font-weight: 600;
          color: #fff;
          font-size: 14px;
        }
        .user-id {
          font-size: 11px;
          color: rgba(250,250,250,0.3);
          margin-top: 1px;
          font-family: 'Manrope', sans-serif;
        }

        .status-dot {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #43D9AD;
          background: rgba(67,217,173,0.1);
          border: 1px solid rgba(67,217,173,0.2);
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
        }
        .status-dot::before {
          content: '';
          width: 6px; height: 6px;
          background: #43D9AD;
          border-radius: 50%;
          display: inline-block;
        }

        /* STATES */
        .state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 72px 24px;
          gap: 12px;
          color: rgba(250,250,250,0.3);
          text-align: center;
        }
        .state-icon { font-size: 36px; opacity: 0.4; }
        .state-title { font-size: 16px; font-weight: 600; color: rgba(250,250,250,0.5); }
        .state-sub { font-size: 13px; }

        .spinner {
          width: 32px; height: 32px;
          border: 3px solid rgba(108,99,255,0.2);
          border-top-color: #6C63FF;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-msg { color: #FF6584; font-size: 13px; }

        /* NO RESULTS */
        .no-results {
          padding: 40px 28px;
          text-align: center;
          color: rgba(250,250,250,0.25);
          font-size: 14px;
        }

        @media (max-width: 720px) {
          .topbar { padding: 0 20px; }
          .search-box input { width: 130px; }
          .page-body { padding: 24px 16px; }
          .summary-row { grid-template-columns: 1fr; }
          .user-table th:nth-child(3),
          .user-table td:nth-child(3) { display: none; }
        }
      `}</style>

      <div className="db-wrap">
        {/* TOP BAR */}
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
          </div>
        </div>

        {/* PAGE BODY */}
        <div className="page-body">
          <div className="page-header">
            <h1>User Dashboard</h1>
            <p>Manage and view all registered users from your database.</p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="summary-row">
            <div className="summary-card">
              <div className="summary-icon icon-purple">👥</div>
              <div>
                <div className="summary-val">{users.length}</div>
                <div className="summary-lbl">Total Users</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon icon-green">✦</div>
              <div>
                <div className="summary-val">{users.length}</div>
                <div className="summary-lbl">Active</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon icon-pink">⬡</div>
              <div>
                <div className="summary-val">{filtered.length}</div>
                <div className="summary-lbl">Shown</div>
              </div>
            </div>
          </div>

          {/* TABLE PANEL */}
          <div className="panel">
            <div className="panel-head">
              <div>
                <div className="panel-head-title">Registered Users</div>
                <div className="panel-head-sub">Live data from /api/vite/user-dashboard</div>
              </div>
            </div>

            {loading ? (
              <div className="state-box">
                <div className="spinner" />
                <div className="state-title">Loading users…</div>
              </div>
            ) : error ? (
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
                    <tr>
                      <td colSpan={4}>
                        <div className="no-results">No users match your search.</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-cell">
                            <div
                              className="avatar"
                              style={{ background: getAvatarColor(user._id) }}
                            >
                              {getInitials(user.user_name)}
                            </div>
                            <div>
                              <div className="user-name">{user.user_name}</div>
                              <div className="user-id">#{user._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span className="status-dot">Active</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;