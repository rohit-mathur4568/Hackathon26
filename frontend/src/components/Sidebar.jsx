import React from 'react';
// Generic import to bypass "export named not found" errors
import * as FA from 'react-icons/fa';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: 'academic', label: 'Academic', icon: <FA.FaChalkboardTeacher /> },
        { id: 'attendance', label: 'Attendance', icon: <FA.FaCheckDouble /> },
        { id: 'learning', label: 'My Learning', icon: <FA.FaBookOpen /> },
        { id: 'canteen', label: 'Canteen', icon: <FA.FaUtensils /> },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50">
            {/* Logo Section */}
            <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                    <FA.FaUserGraduate />
                </div>
                <h1 className="text-xl font-black tracking-tighter">CampusHub</h1>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Footer Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                    <FA.FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
}