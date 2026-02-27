import React, { useState, useEffect } from 'react';
import * as FA from 'react-icons/fa';

export default function FacultyDashboard({ currentUser }) {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Role 5 = Student
                const res = await fetch(`http://localhost:5000/api/admin/users/role/5/${currentUser.dept_id}?branch_id=${currentUser.branch_id}`);
                const data = await res.json();
                setStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Faculty Fetch Error:", err);
            }
        };
        if (currentUser?.branch_id) fetchStudents();
    }, [currentUser]);

    return (
        <div className="animate-fade-in space-y-8">
            <header className="flex justify-between items-center bg-indigo-900 text-white p-10 rounded-[3rem] shadow-2xl">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Academic Console</h2>
                    <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mt-2">
                        {currentUser?.name} | B.Tech Faculty
                    </p>
                </div>
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20">
                    <FA.FaChalkboardTeacher size={32} />
                </div>
            </header>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Class Roll - Engineering Mathematics 2</h3>
                <div className="space-y-3">
                    {students.map(s => (
                        <div key={s.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center hover:shadow-md transition-all">
                            <span className="font-bold text-slate-700">{s.name}</span>
                            <div className="flex gap-2">
                                <button className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase">P</button>
                                <button className="px-5 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase">A</button>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && <p className="text-slate-400 italic">No students assigned to your branch yet.</p>}
                </div>
            </div>
        </div>
    );
}