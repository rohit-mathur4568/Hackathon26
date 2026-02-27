import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import * as FA from 'react-icons/fa';

export default function StudentDashboard({ currentUser, canteenMenu, onLogout }) {
    const [activeTab, setActiveTab] = useState('academic');
    const [notes, setNotes] = useState([]);

    // Logic to fetch notes based on your branch and semester
    useEffect(() => {
        if (activeTab === 'academic') {
            fetch(`http://localhost:5000/api/student/notes/${currentUser.branch_id}/${currentUser.current_semester || 2}`)
                .then(res => res.json())
                .then(data => setNotes(Array.isArray(data) ? data : []))
                .catch(e => console.error("LMS Fetch Error:", e));
        }
    }, [activeTab, currentUser]);

    return (
        <div className="flex bg-[#f8fafc] min-h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

            <div className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Dashboard</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            B.Tech Student | Welcome, {currentUser.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-black text-indigo-600 underline decoration-indigo-100 underline-offset-4">82% Overall Attendance</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <FA.FaUserGraduate />
                        </div>
                    </div>
                </header>

                {/* 📔 ACADEMIC & LMS VIEW */}
                {activeTab === 'academic' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-indigo-500 transition-all">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-600"><FA.FaBook /> Current Progress</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 font-bold text-slate-700">
                                            <span>Engineering Mathematics 2</span>
                                            <span className="text-indigo-600">82%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 italic">Preparing for end-semester examinations.</p>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                                <FA.FaShieldAlt className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform" size={140} />
                                <h3 className="font-bold text-xl text-indigo-400">Project: PhishGuard</h3>
                                <p className="text-slate-400 text-sm mt-2 mb-6 leading-relaxed">Cybersecurity module for phishing detection.</p>
                                <button className="bg-indigo-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500">Update Repo</button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><FA.FaCloudDownloadAlt className="text-indigo-500" /> My Learning (LMS)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map(n => (
                                    <div key={n.id} className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center group hover:bg-white hover:border-indigo-500 transition-all">
                                        <span className="font-bold text-slate-700">{n.title}</span>
                                        <button className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"><FA.FaDownload /></button>
                                    </div>
                                ))}
                                {notes.length === 0 && <p className="text-slate-400 text-sm italic py-4">No notes uploaded for Semester {currentUser.current_semester || 2} yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* 🍔 CANTEEN VIEW (canteenMenu is now used here) */}
                {activeTab === 'canteen' && (
                    <div className="animate-fade-in bg-white p-8 rounded-[3rem] border shadow-sm">
                        <h3 className="font-bold text-2xl mb-8 flex items-center gap-3"><FA.FaUtensils className="text-orange-500" /> Campus Kitchen</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {canteenMenu.map(item => (
                                <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex justify-between items-center hover:bg-white hover:border-indigo-200 hover:shadow-lg transition-all group">
                                    <div>
                                        <p className="font-bold text-slate-700">{item.name}</p>
                                        <p className="text-indigo-600 font-black text-sm">₹{item.price}</p>
                                    </div>
                                    <button className="bg-slate-900 group-hover:bg-indigo-600 text-white p-4 rounded-2xl transition-all shadow-md active:scale-90">
                                        <FA.FaShoppingCart size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}