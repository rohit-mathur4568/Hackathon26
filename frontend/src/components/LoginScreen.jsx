import React, { useState } from 'react';

export default function LoginScreen({ onLoginSuccess }) {
    const [loginEmail, setLoginEmail] = useState('super@erp.com');
    const [loginPass, setLoginPass] = useState('password123');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            console.log("Authenticating user...");
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPass })
            });

            const serverData = await response.json();

            if (serverData.success) {
                onLoginSuccess(serverData.user);
            } else {
                setErrorMsg(serverData.error || "Invalid Credentials!");
            }
        } catch (err) {
            setErrorMsg('Server unavailable. Please check backend connection.');
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4" style={{ backgroundImage: "radial-gradient(circle at 50% -20%, #312e81, #0f172a)" }}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center shadow-lg mb-4 text-3xl">🎓</div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Campus<span className="text-indigo-400">Hub</span></h1>
                    <p className="text-indigo-200/60 text-sm mt-1">Smart Campus Utility App</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {errorMsg && <div className="bg-red-500/20 border border-red-500 text-red-300 p-2 rounded text-sm text-center font-semibold">{errorMsg}</div>}

                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Email</label>
                        <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required
                            className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Password</label>
                        <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required
                            className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500" />
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold transition-all shadow-md mt-2">
                        {isLoading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-700 text-center flex justify-center gap-2">
                    <button onClick={() => setLoginEmail('super@erp.com')} className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded">Admin</button>
                    <button onClick={() => setLoginEmail('canteen@erp.com')} className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded">Canteen</button>
                </div>
            </div>
        </div>
    );
}