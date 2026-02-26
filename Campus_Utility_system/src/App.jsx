import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import AttendanceWidget from './components/AttendenceWidgets';
import CanteenWidget from './components/CanteenWidgets';
import NotesWidget from './components/NotesWidgets';
import AdminPanel from './components/AdminPannel';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans text-slate-800 relative">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 pt-20">
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className="absolute top-6 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
        >
          {isAdmin ? 'Student View' : 'Admin Panel'}
        </button>

        {isAdmin ? (
          <AdminPanel />
        ) : (
          <div>
            <header className="mb-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back!
                  </h2>
                  <p className="text-slate-500 mt-1">Here is what is happening with your campus activities today.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-xs text-slate-500">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    S
                  </div>
                </div>
              </div>
            </header>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="space-y-8 xl:col-span-1">
                <AttendanceWidget />
                <CanteenWidget />
              </div>
              <div className="xl:col-span-2">
                <NotesWidget />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
