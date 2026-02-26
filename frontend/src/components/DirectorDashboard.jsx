import React, { useState, useEffect } from 'react';
import { FaUserTie, FaCodeBranch, FaPlusCircle, FaCheckCircle, FaTrash, FaLock, FaUsers } from 'react-icons/fa';

export default function DirectorDashboard({ currentUser }) {
    const [branches, setBranches] = useState([]);
    const [hods, setHods] = useState([]);
    const [newBranchName, setNewBranchName] = useState('');

    const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '3', branch_id: '' });
    const [msg, setMsg] = useState('');

    // 1. Fetch Branches for this Department
    const fetchBranches = () => {
        fetch(`http://localhost:5000/api/admin/branches/${currentUser.dept_id}`)
            .then(res => res.json())
            .then(data => {
                setBranches(data);
                if (data.length > 0 && !formData.branch_id) {
                    setFormData(prev => ({ ...prev, branch_id: data[0].id }));
                }
            })
            .catch(err => console.error("Branch fetch error:", err));
    };

    // 2. Fetch HODs for this Department
    const fetchHods = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/role/3/${currentUser.dept_id}`);
            const data = await res.json();
            setHods(data);
        } catch (err) {
            console.error("HOD fetch failed:", err);
        }
    };

    useEffect(() => {
        fetchBranches();
        fetchHods();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3. Create New Branch
    const handleCreateBranch = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/admin/add-branch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dept_id: currentUser.dept_id, name: newBranchName })
            });
            const data = await res.json();
            if (data.success) {
                setNewBranchName('');
                fetchBranches();
                alert(data.message);
            }
        } catch (err) {
            console.error("Branch creation error:", err);
        }
    };

    // 4. Delete Branch
    const handleDeleteBranch = async (id, name) => {
        if (!window.confirm(`Delete branch ${name}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/branch/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchBranches();
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Delete branch error:", err);
        }
    };

    // 5. Onboard HOD
    const handleAddHOD = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            dept_id: currentUser.dept_id,
            added_by: currentUser.id
        };

        try {
            const res = await fetch('http://localhost:5000/api/admin/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setMsg(data.message);
                setFormData({ ...formData, name: '', email: '', password: '' });
                fetchHods(); // Refresh list to show new HOD
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("HOD onboarding error:", err);
        }
    };

    // 6. Delete HOD Account
    const handleDeleteHOD = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this HOD account?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/user/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                fetchHods();
            }
        } catch (err) {
            console.error("HOD deletion error:", err);
        }
    };

    return (
        <div className="animate-fade-in p-2">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                    <FaUserTie className="text-3xl text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Director Control Panel</h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-70">Academic Management</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* BRANCH SECTION */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-5 flex items-center gap-2 text-emerald-700">
                            <FaCodeBranch /> Quick Branch Add
                        </h3>
                        <form onSubmit={handleCreateBranch} className="space-y-3">
                            <input
                                type="text" required value={newBranchName} onChange={(e) => setNewBranchName(e.target.value)}
                                className="w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm font-semibold"
                                placeholder="e.g. B.Tech CSE"
                            />
                            <button type="submit" className="w-full bg-emerald-600 text-white font-black py-3 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95">
                                Add Branch
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">Live Branches</h4>
                            <div className="space-y-2">
                                {branches.map(b => (
                                    <div key={b.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex justify-between items-center group hover:border-emerald-200 transition-all">
                                        <span className="font-bold text-slate-700 text-sm">{b.name}</span>
                                        <button onClick={() => handleDeleteBranch(b.id, b.name)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOD MANAGEMENT SECTION */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Onboarding Form */}
                    <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-emerald-700">
                            <FaPlusCircle /> Assign Branch Head (HOD)
                        </h3>

                        {msg && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold flex items-center gap-2 border border-emerald-100 animate-bounce">{msg}</div>}

                        <form onSubmit={handleAddHOD} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Select Target Branch</label>
                                <select required value={formData.branch_id} onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                                    className="w-full mt-1.5 border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus:border-emerald-500 outline-none font-bold text-sm">
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full mt-1.5 border border-slate-200 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Prof. Amit Verma" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full mt-1.5 border border-slate-200 rounded-2xl px-4 py-3 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="verma@campus.edu" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Portal Password</label>
                                <div className="relative">
                                    <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full mt-1.5 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 focus:border-emerald-500 outline-none font-mono" placeholder="••••••••" />
                                    <FaLock className="absolute left-4 top-5 text-slate-300" />
                                </div>
                            </div>

                            <button type="submit" className="md:col-span-2 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-emerald-600 transition-all active:scale-95 text-sm uppercase tracking-widest">
                                Confirm Onboarding
                            </button>
                        </form>
                    </div>

                    {/* HOD List Table */}
                    <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                <FaUsers className="text-emerald-500" /> Active Branch HODs
                            </h3>
                            <button onClick={fetchHods} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-all uppercase tracking-widest">Sync List</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-4">Name</th>
                                        <th className="px-4 py-4">Contact</th>
                                        <th className="px-4 py-4 text-right">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {hods.length === 0 ? (
                                        <tr><td colSpan="3" className="px-4 py-10 text-center text-slate-400 text-sm font-medium italic">Waiting for assignments...</td></tr>
                                    ) : (
                                        hods.map((h) => (
                                            <tr key={h.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-4 py-4 text-sm font-bold text-slate-800">{h.name}</td>
                                                <td className="px-4 py-4 text-sm text-slate-500 font-semibold">{h.email}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <button onClick={() => handleDeleteHOD(h.id)} className="text-slate-300 hover:text-red-500 p-2 transition-all opacity-0 group-hover:opacity-100">
                                                        <FaTrash size={12} />
                                                    </button>
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
        </div>
    );
}