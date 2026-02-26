import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaGraduationCap, FaExternalLinkAlt, FaBook, FaCheckCircle, FaUtensils, FaShoppingCart } from 'react-icons/fa';

export default function StudentDashboard({ canteenMenu, currentUser, onLogout }) {
    const [activeTab, setActiveTab] = useState('academic');

    return (
        <div className="flex bg-slate-50 min-h-screen">
            {/* 1. Fixed Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

            {/* 2. Main Content Area */}
            <main className="flex-1 ml-64 p-8">

                {/* Header with User Info */}
                <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Welcome, {currentUser.name}!</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            B.Tech Student | SEM {currentUser.current_semester || '2'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-black text-slate-700 underline decoration-indigo-200 underline-offset-4">82% Attendance</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200">
                            <FaGraduationCap />
                        </div>
                    </div>
                </header>

                {/* 📔 ACADEMIC TAB */}
                {activeTab === 'academic' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Current Subject Progress */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-600">
                                    <FaBook /> Academic Progress
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-slate-700 underline decoration-slate-200">Engineering Mathematics 2</span>
                                            <span className="text-indigo-600 font-black">82%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 italic">Preparing for upcoming examinations.</p>
                                </div>
                            </div>

                            {/* Important Notices Quick View */}
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-400">
                                    <FaCheckCircle /> Quick Actions
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Check your latest assignment deadlines and class schedules for this week.</p>
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">View Timetable</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🍔 CANTEEN TAB (Warning Fix: canteenMenu is used here) */}
                {activeTab === 'canteen' && (
                    <div className="animate-fade-in bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-2xl mb-8 flex items-center gap-3 text-slate-800">
                            <FaUtensils className="text-orange-500" /> Digital Canteen
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {canteenMenu.map(item => (
                                <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-[2rem] flex justify-between items-center hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all group">
                                    <div>
                                        <p className="font-bold text-slate-700">{item.name}</p>
                                        <p className="text-indigo-600 font-black text-sm">₹{item.price}</p>
                                    </div>
                                    <button className="bg-slate-900 group-hover:bg-indigo-600 text-white p-3 rounded-2xl transition-all shadow-lg active:scale-90">
                                        <FaShoppingCart size={14} />
                                    </button>
                                </div>
                            ))}
                            {canteenMenu.length === 0 && <p className="text-slate-400 italic py-10">Updating delicious items...</p>}
                        </div>
                    </div>
                )}

                {/* 📖 MY LEARNING (CAMU Style) */}
                {activeTab === 'learning' && (
                    <div className="animate-fade-in flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                            <FaBook />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Learning Management System</h3>
                        <p className="text-slate-400 mt-2 max-w-sm text-center font-medium">Access your Engineering Mathematics 2 resources and Software Engineering notes here.</p>
                        <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2">
                            Enter Portal <FaExternalLinkAlt size={12} />
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}