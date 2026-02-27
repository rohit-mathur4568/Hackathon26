import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import DirectorDashboard from './components/DirectorDashboard';
import HODDashboard from './components/HODDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';
import CanteenDashboard from './components/CanteenDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [canteenMenu, setCanteenMenu] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetch('http://localhost:5000/api/facility/canteen/menu')
        .then(res => res.json())
        .then(data => setCanteenMenu(Array.isArray(data) ? data : []))
        .catch(err => console.error("Menu Fetch Error:", err));
    }
  }, [currentUser]);

  if (!currentUser) return <LoginScreen onLoginSuccess={setCurrentUser} />;

  const isStudent = currentUser.role_name === 'Student';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {!isStudent && <Navbar currentUser={currentUser} onLogout={() => setCurrentUser(null)} />}

      <main className={isStudent ? "" : "max-w-7xl mx-auto px-6 py-8"}>
        {currentUser.role_name === 'SuperAdmin' && <AdminDashboard currentUser={currentUser} />}
        {currentUser.role_name === 'DeptDirector' && <DirectorDashboard currentUser={currentUser} />}
        {currentUser.role_name === 'BranchHOD' && <HODDashboard currentUser={currentUser} />}

        {(currentUser.role_name === 'FACULTY' || currentUser.role_name === 'Faculty') && (
          <FacultyDashboard currentUser={currentUser} />
        )}

        {isStudent && (
          <StudentDashboard
            currentUser={currentUser}
            canteenMenu={canteenMenu}
            onLogout={() => setCurrentUser(null)}
          />
        )}

        {currentUser.role_name === 'CanteenAdmin' && <CanteenDashboard />}
      </main>
    </div>
  );
}

export default App;