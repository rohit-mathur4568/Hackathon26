import React, { useState, useEffect } from 'react';

export default function CanteenWidget() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/canteen/menu')
      .then(r => r.json())
      .then(d => {
        setMenu(d);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  const orderItem = async (id, name) => {
    setOrdering(id);
    try {
      await fetch('http://localhost:5000/api/canteen/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, quantity: 1 })
      });
      alert(`✅ Ordered ${name}!`);
    } catch (e) {
      alert('Failed to place order');
    }
    setOrdering(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">🍔</span>
          Canteen Express
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-orange-100 rounded-full text-orange-600">Hot Meals</span>
      </div>
      
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {menu?.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-xl">
                  🍽️
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm font-bold text-orange-600">₹{item.price}</p>
                </div>
              </div>
              <button 
                onClick={() => orderItem(item.id, item.name)}
                disabled={ordering === item.id}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 shadow-md"
              >
                {ordering === item.id ? '⏳' : 'Order'}
              </button>
            </div>
          ))}
          {!menu?.length && (
            <p className="text-center text-slate-400 py-4">No menu items available</p>
          )}
        </div>
      )}
    </div>
  );
}
