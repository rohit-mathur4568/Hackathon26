import React, { useState, useEffect } from 'react';

// ==========================================
// 📦 COMPONENTS IMPORT
// ==========================================
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import NoticeBoard from './components/NoticeBoard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import DirectorDashboard from './components/DirectorDashboard';
import HODDashboard from './components/HODDashboard';
import FacultyDashboard from './components/FacultyDashboard'; // 👈 Naya Import

// Note: React Icons install hona zaroori hai (npm install react-icons)
import { FaUtensils, FaUserSlash } from 'react-icons/fa';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [canteenMenu, setCanteenMenu] = useState([]);

  // ==========================================
  // 🔄 GLOBAL DATA FETCHING
  // ==========================================
  useEffect(() => {
    if (currentUser) {
      console.log("Logged in as:", currentUser.role_name);

      const targetBranch = currentUser.branch_id || 'null';

      // 1. Fetch Notices
      fetch(`http://localhost:5000/api/facility/notices/${targetBranch}`)
        .then(res => res.json())
        .then(data => setNotices(data))
        .catch(err => console.error("Notice fetch error", err));

      // 2. Fetch Canteen Menu
      fetch('http://localhost:5000/api/facility/canteen/menu')
        .then(res => res.json())
        .then(data => setCanteenMenu(data))
        .catch(err => console.error("Menu fetch error", err));
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <NoticeBoard notices={notices} />

        {/* ------------------------------------------- */}
        {/* ROLE-BASED DASHBOARD ROUTING */}
        {/* ------------------------------------------- */}

        {/* 1. SUPER ADMIN VIEW */}
        {currentUser.role_name === 'SuperAdmin' && (
          <AdminDashboard currentUser={currentUser} />
        )}

        {/* 2. DEPT DIRECTOR VIEW */}
        {currentUser.role_name === 'DeptDirector' && (
          <DirectorDashboard currentUser={currentUser} />
        )}

        {/* 3. BRANCH HOD VIEW */}
        {currentUser.role_name === 'BranchHOD' && (
          <HODDashboard currentUser={currentUser} />
        )}

        {/* 4. STUDENT VIEW */}
        {currentUser.role_name === 'Student' && (
          <StudentDashboard
            canteenMenu={canteenMenu}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {/* 5. FACULTY VIEW (Case Insensitive Support) */}
        {(currentUser.role_name === 'FACULTY' || currentUser.role_name === 'Faculty') && (
          <FacultyDashboard currentUser={currentUser} />
        )}

        {/* 6. CANTEEN ADMIN VIEW */}
        {currentUser.role_name === 'CanteenAdmin' && (
          <div className="animate-fade-in">
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                <FaUtensils />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Canteen Management</h2>
              <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto italic">
                Wait for students to place orders. Live kitchen queue will appear here.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------- */}
        {/* ⚠️ SAFETY FALLBACK */}
        {/* ------------------------------------------- */}
        {!['SuperAdmin', 'DeptDirector', 'BranchHOD', 'Student', 'CanteenAdmin', 'FACULTY', 'Faculty'].includes(currentUser.role_name) && (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-pulse">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              <FaUserSlash />
            </div>
            <h2 className="text-3xl font-black text-slate-800">Invalid Role Detected</h2>
            <p className="text-slate-500 mt-2 font-bold tracking-wide">
              Found Role: <span className="text-rose-600 uppercase">"{currentUser.role_name}"</span>
            </p>
            <button onClick={handleLogout} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all">
              Go Back to Login
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;