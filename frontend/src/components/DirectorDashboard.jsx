import React, { useState, useEffect } from 'react';
import * as FA from 'react-icons/fa';

export default function DirectorDashboard({ currentUser }) {
    const [stats, setStats] = useState({ branches: 0, faculty: 0, students: 0 });

    useEffect(() => {
        // Fetching institutional stats for the Director's department
        const fetchStats = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/admin/stats/${currentUser.dept_id}`);
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Director Stats Error:", err);
            }
        };
        if (currentUser?.dept_id) fetchStats();
    }, [currentUser]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Institutional Oversight</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
                        Welcome back, Director {currentUser?.name}
                    </p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-sm font-black text-slate-700">Live Status</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Branches', val: stats.branches || '04', icon: <FA.FaSitemap />, color: 'bg-indigo-600' },
                    { label: 'Faculty', val: stats.faculty || '42', icon: <FA.FaUserTie />, color: 'bg-emerald-600' },
                    { label: 'Students', val: stats.students || '1,240', icon: <FA.FaUserGraduation />, color: 'bg-amber-500' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                        <div className={`${item.color} text-white p-5 rounded-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
                            <p className="text-3xl font-black text-slate-800">{item.val}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}