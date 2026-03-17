import { Routes, Route } from 'react-router-dom';
import './App.css';
import Registration from './page/Registration';
import Login from './page/Login';
import IndexPage from './page/index';
import UserDashboard from './components/UserDashboard/Dashboard'
import AdminDashboard from './admin/admin-dashboard';

function App() {
  return (

      <div className="App">
        <Routes>
        
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
   
  );
}

export default App;