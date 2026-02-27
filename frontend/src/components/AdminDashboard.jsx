import React, { useState, useEffect } from 'react';
import { FaUserShield, FaBuilding, FaPlusCircle, FaCheckCircle, FaExclamationCircle, FaTrash, FaLock } from 'react-icons/fa';

export default function AdminDashboard({ currentUser }) {
    const [departments, setDepartments] = useState([]);
    const [newDeptName, setNewDeptName] = useState('');

    const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '2', dept_id: '' });
    const [status, setStatus] = useState({ loading: false, msg: '', type: '' });

    const fetchDepartments = () => {
        fetch('http://localhost:5000/api/admin/departments')
            .then(res => res.json())
            .then(data => {
                setDepartments(data);
                if (data.length > 0 && !formData.dept_id) {
                    setFormData(prev => ({ ...prev, dept_id: data[0].id }));
                }
            });
    };

    useEffect(() => {
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteDept = async (id, deptName) => {
        if (!window.confirm(`Are you sure? This will delete ${deptName} department.`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/department/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchDepartments();
                alert(data.message);
            } else { alert(`Error: ${data.error}`); }
        } catch (err) {
            console.error("Delete operation failed:", err); // Fixes Line 37 ESLint
            alert("Server error while deleting.");
        }
    };

    const handleCreateDept = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/admin/add-department', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newDeptName })
        });
        const data = await res.json();
        if (data.success) {
            setNewDeptName('');
            fetchDepartments();
            alert(data.message);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, msg: '', type: '' });

        const payload = {
            ...formData,
            dept_id: formData.role_id === '6' ? null : formData.dept_id,
            added_by: currentUser.id
        };

        try {
            const res = await fetch('http://localhost:5000/api/admin/add-user', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ loading: false, msg: data.message, type: 'success' });
                setFormData({ ...formData, name: '', email: '', password: '' });
            } else {
                setStatus({ loading: false, msg: data.error, type: 'error' });
            }
        } catch (err) {
            console.error("User onboarding failed:", err); // Fixes Line 78 ESLint
            setStatus({ loading: false, msg: 'Server error!', type: 'error' });
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <FaUserShield className="text-3xl text-indigo-600" />
                <h2 className="text-2xl font-bold text-slate-800">Super Admin Control Center</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FaBuilding className="text-indigo-500" /> 1. Create Department
                        </h3>
                        <form onSubmit={handleCreateDept} className="flex gap-2">
                            <input type="text" required value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none" placeholder="e.g. Engineering" />
                            <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                Create
                            </button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FaPlusCircle className="text-indigo-500" /> 2. Onboard Staff
                        </h3>

                        {status.msg && (
                            <div className={`mb-4 p-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                    <select value={formData.role_id} onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:border-indigo-500 outline-none">
                                        <option value="2">Dept Director</option>
                                        <option value="6">Canteen Admin</option>
                                    </select>
                                </div>
                                {formData.role_id === '2' && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                                        <select required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
                                            className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:border-indigo-500 outline-none">
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none" placeholder="Enter Name" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none" placeholder="Email" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Set Password</label>
                                    <div className="relative">
                                        <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full mt-1 border border-slate-300 rounded-lg pl-8 pr-3 py-2 focus:border-indigo-500 outline-none font-mono" placeholder="••••••••" />
                                        <FaLock className="absolute left-2.5 top-3.5 text-slate-400 text-xs" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={status.loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95">
                                {status.loading ? 'Creating...' : 'Onboard User'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
                        <h3 className="text-xl font-black mb-6 flex justify-between items-center">
                            Managed Departments <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs">{departments.length}</span>
                        </h3>
                        <div className="space-y-3">
                            {departments.map(d => (
                                <div key={d.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                                    <span className="font-bold tracking-wide">{d.name}</span>
                                    <button onClick={() => handleDeleteDept(d.id, d.name)} className="text-slate-500 hover:text-red-500 p-2 transition-colors">
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}