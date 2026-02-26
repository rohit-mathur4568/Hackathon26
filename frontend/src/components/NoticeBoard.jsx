import React from 'react';

export default function NoticeBoard({ notices }) {
    if (!notices || notices.length === 0) return null;

    return (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
            <h3 className="font-bold text-yellow-800 flex items-center gap-2"><span>📢</span> Official Notice Board</h3>
            <ul className="mt-2 space-y-2">
                {notices.map(notice => (
                    <li key={notice.id} className="text-sm text-yellow-800 font-medium">
                        <strong className="text-yellow-900">{notice.title}:</strong> {notice.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}