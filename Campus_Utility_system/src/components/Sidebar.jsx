import React from 'react';

export default function Sidebar() {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '📅', label: 'Attendance', active: false },
    { icon: '🍔', label: 'Canteen', active: false },
    { icon: '📚', label: 'Notes', active: false },
    { icon: '📅', label: 'Schedule', active: false },
    { icon: '💬', label: 'Messages', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-20">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">🎓</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Campus</h1>
            <p className="text-xs text-slate-400 -mt-1">Utility Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              item.active
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center font-bold text-slate-900">
            S
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Student</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
}
