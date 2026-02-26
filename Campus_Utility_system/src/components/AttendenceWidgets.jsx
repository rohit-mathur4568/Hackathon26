import React, { useState, useEffect } from 'react';

export default function AttendanceWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/attendance')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (percent) => {
    if (percent >= 85) return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Excellent' };
    if (percent >= 75) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Good' };
    if (percent >= 60) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Warning' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Low' };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">📊</span>
          Attendance
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">This Month</span>
      </div>
      
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((rec) => {
            const percent = Math.round((rec.attended / rec.total) * 100);
            const status = getStatusColor(percent);
            return (
              <div key={rec.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700 text-sm">{rec.subject}</span>
                  <span className={`font-bold text-sm ${status.text}`}>{percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${status.bg} transition-all duration-500`} 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>{rec.attended} present</span>
                  <span>{rec.total - rec.attended} absent</span>
                </div>
              </div>
            );
          })}
          {!data?.length && (
            <p className="text-center text-slate-400 py-4">No attendance records found</p>
          )}
        </div>
      )}
    </div>
  );
}
