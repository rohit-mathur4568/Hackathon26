import React, { useState, useEffect } from 'react';
import * as FA from 'react-icons/fa';

export default function CanteenDashboard() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Initial fetch + Poll every 10 seconds for live orders
        const fetchOrders = () => {
            fetch('http://localhost:5000/api/facility/canteen/orders')
                .then(res => res.json())
                .then(data => setOrders(Array.isArray(data) ? data : []))
                .catch(err => console.error("Canteen Sync Error:", err));
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const markComplete = async (id) => {
        await fetch(`http://localhost:5000/api/facility/canteen/order/${id}`, { method: 'PATCH' });
        setOrders(orders.filter(o => o.id !== id));
    };

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                <FA.FaUtensils className="text-orange-500" /> Live Kitchen Queue
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm group">
                        <p className="text-[10px] font-black text-orange-600 mb-1 uppercase tracking-tighter">New Order</p>
                        <h4 className="font-black text-xl text-slate-800">{order.item_name}</h4>
                        <p className="text-sm font-bold text-slate-400 mt-1">Student ID: {order.student_id}</p>
                        <button
                            onClick={() => markComplete(order.id)}
                            className="w-full mt-6 bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] hover:bg-orange-600 transition-all"
                        >
                            Mark Ready
                        </button>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="col-span-4 text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for incoming orders...</p>
                    </div>
                )}
            </div>
        </div>
    );
}