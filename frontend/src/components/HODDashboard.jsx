import React, { useState, useEffect } from 'react';
// Generic import style to avoid "export named not found" errors
import * as FA from 'react-icons/fa';

export default function HODDashboard({ currentUser }) {
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);
    const [status, setStatus] = useState({ loading: false, msg: '', type: '' });
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '4', semester: '1' });

    const refreshListData = async () => {
        if (!currentUser?.dept_id || !currentUser?.branch_id) return;
        try {
            const resF = await fetch(`http://localhost:5000/api/admin/users/role/4/${currentUser.dept_id}?branch_id=${currentUser.branch_id}`);
            const dataF = await resF.json();
            setFaculties(Array.isArray(dataF) ? dataF : []);

            const resS = await fetch(`http://localhost:5000/api/admin/users/role/5/${currentUser.dept_id}?branch_id=${currentUser.branch_id}`);
            const dataS = await resS.json();
            setStudents(Array.isArray(dataS) ? dataS : []);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => {
        refreshListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.branch_id]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, msg: '', type: '' });
        const payload = { ...formData, dept_id: currentUser.dept_id, branch_id: currentUser.branch_id, added_by: currentUser.id };

        try {
            const res = await fetch('http://localhost:5000/api/admin/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setStatus({ loading: false, msg: `✅ Added successfully!`, type: 'success' });
                setFormData({ ...formData, name: '', email: '', password: '' });
                refreshListData();
            } else { setStatus({ loading: false, msg: data.error, type: 'error' }); }
            // Is block ko replace karo:
        } catch (err) {
            console.error("Critical: User Registration Failed", err); // Ab 'err' use ho gaya!
            setStatus({ loading: false, msg: 'Server Error', type: 'error' });
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete ${name}?`)) return;
        await fetch(`http://localhost:5000/api/admin/user/${id}`, { method: 'DELETE' });
        refreshListData();
    };

    return (
        <div className="animate-fade-in p-4">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg">
                    <FA.FaUserTie size={30} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">HOD Portal</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{currentUser?.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-600">
                            <FA.FaPlusCircle /> Register Staff/Student
                        </h3>
                        {status.msg && <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{status.msg}</div>}
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <select value={formData.role_id} onChange={(e) => setFormData({ ...formData, role_id: e.target.value })} className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 font-bold text-sm">
                                <option value="4">Faculty Member</option>
                                <option value="5">Student</option>
                            </select>
                            {formData.role_id === '5' && (
                                <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 font-bold text-sm">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                </select>
                            )}
                            <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none font-bold text-sm" />
                            <input type="email" required placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none font-bold text-sm" />
                            <div className="relative">
                                <input type="password" required placeholder="Set Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none font-mono text-sm" />
                                <FA.FaLock className="absolute left-4 top-4 text-slate-300" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest">Onboard Now</button>
                        </form>
                    </div>
                </div>

                {/* Lists Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FA.FaUserGraduate className="text-indigo-500" /> Department List</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Faculty List */}
                            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                                <h4 className="text-xs font-black text-slate-400 uppercase mb-3">Faculty ({faculties.length})</h4>
                                <div className="space-y-2">
                                    {faculties.map(f => (
                                        <div key={f.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
                                            <span className="text-sm font-bold text-slate-700">{f.name}</span>
                                            <button onClick={() => handleDelete(f.id, f.name)} className="text-slate-300 hover:text-red-500 transition-all"><FA.FaTrash size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Student List */}
                            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                                <h4 className="text-xs font-black text-slate-400 uppercase mb-3">Students ({students.length})</h4>
                                <div className="space-y-2">
                                    {students.map(s => (
                                        <div key={s.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm">
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{s.name}</p>
                                                <p className="text-[10px] text-indigo-500 font-bold uppercase">Sem {s.current_semester || 1}</p>
                                            </div>
                                            <button onClick={() => handleDelete(s.id, s.name)} className="text-slate-300 hover:text-red-500 transition-all"><FA.FaTrash size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}