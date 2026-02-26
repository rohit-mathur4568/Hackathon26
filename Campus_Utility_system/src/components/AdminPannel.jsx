import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/canteen/orders')
      .then(r => r.json())
      .then(d => {
        setOrders(d);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'preparing': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
      case 'ready': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
      case 'delivered': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' };
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status?.toLowerCase() === filter);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold">A</span>
            Canteen Admin Dashboard
          </h2>
          <p className="text-slate-500 mt-1">Manage and track all food orders</p>
        </div>
        <div className="flex gap-2">
          {['all', 'preparing', 'ready', 'delivered'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-12 bg-slate-100 rounded-xl mb-4"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl mb-2"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-600">Order ID</th>
                <th className="p-4 font-bold text-slate-600">Item ID</th>
                <th className="p-4 font-bold text-slate-600">Quantity</th>
                <th className="p-4 font-bold text-slate-600">Status</th>
                <th className="p-4 font-bold text-slate-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((o, i) => {
                const statusStyle = getStatusStyle(o.status);
                return (
                  <tr key={o.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-4 font-bold text-slate-800">#{o.id}</td>
                    <td className="p-4 text-slate-600">Item {o.item_id}</td>
                    <td className="p-4 text-slate-600">{o.quantity}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                        {o.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">Just now</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filteredOrders?.length && (
            <div className="text-center py-12 text-slate-400">
              No orders found
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-xl text-white">
          <p className="text-sm opacity-80">Preparing</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.status?.toLowerCase() === 'preparing').length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-xl text-white">
          <p className="text-sm opacity-80">Ready</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.status?.toLowerCase() === 'ready').length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-4 rounded-xl text-white">
          <p className="text-sm opacity-80">Delivered</p>
          <p className="text-2xl font-bold">{orders.filter(o => o.status?.toLowerCase() === 'delivered').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-4 rounded-xl text-white">
          <p className="text-sm opacity-80">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
      </div>
    </div>
  );
}
