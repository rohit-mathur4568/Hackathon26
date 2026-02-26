import React, { useState, useEffect } from 'react';
import * as FA from 'react-icons/fa';

export default function FacultyDashboard({ currentUser }) {
    const [students, setStudents] = useState([]);
    const [selectedSem, setSelectedSem] = useState('1');

    const fetchMyStudents = async () => {
        try {
            // Role 5 = Students
            const res = await fetch(`http://localhost:5000/api/admin/users/role/5/${currentUser.dept_id}?branch_id=${currentUser.branch_id}`);
            const data = await res.json();
            // Filter by selected semester
            const filtered = data.filter(s => s.current_semester == selectedSem);
            setStudents(filtered);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => {
        fetchMyStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSem]);

    return (
        <div className="animate-fade-in p-4">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-lg">
                    <FA.FaUserEdit size={30} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Faculty Dashboard</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{currentUser?.name} | {currentUser?.role_name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h3 className="font-bold text-xl flex items-center gap-3">
                            <FA.FaCheckDouble className="text-rose-500" /> Mark Daily Attendance
                        </h3>

                        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <button
                                    key={sem}
                                    onClick={() => setSelectedSem(sem.toString())}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedSem == sem ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    SEM {sem}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center py-20 text-slate-400 italic font-medium">No students registered for Semester {selectedSem}</td></tr>
                                ) : (
                                    students.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-800">{s.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{s.email}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Present</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all">P</button>
                                                    <button className="bg-white border border-slate-200 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-500 transition-all">A</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}