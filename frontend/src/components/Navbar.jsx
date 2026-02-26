import React from 'react';

export default function Navbar({ currentUser, onLogout }) {
    return (
        <nav className="bg-slate-900 text-white px-6 py-3 shadow-md flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-lg shadow-sm">🎓</div>
                <h1 className="text-xl font-bold tracking-wide">Campus<span className="text-indigo-400">Hub</span></h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 tracking-wider uppercase">{currentUser.role_name}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded font-semibold transition-colors text-sm border border-red-500/20"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}