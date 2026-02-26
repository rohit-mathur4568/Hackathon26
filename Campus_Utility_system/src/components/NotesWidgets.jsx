import React, { useState, useEffect } from 'react';

export default function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchNotes = () => fetch('http://localhost:5000/api/notes')
    .then(r => r.json())
    .then(d => {
      setNotes(d);
      setLoading(false);
    })
    .catch(e => {
      console.log(e);
      setLoading(false);
    });

  useEffect(() => { 
    fetchNotes(); 
  }, []);

  const uploadNote = async (e) => {
    e.preventDefault();
    if (!title) return;
    
    setPosting(true);
    try {
      await fetch('http://localhost:5000/api/notes/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author: author || 'Student' })
      });
      setTitle('');
      setAuthor('');
      fetchNotes();
    } catch (e) {
      console.error(e);
    }
    setPosting(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">📚</span>
          Notes Sharing
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-purple-100 rounded-full text-purple-600">{notes.length} Notes</span>
      </div>
      
      <form onSubmit={uploadNote} className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Note Title" 
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input 
          type="text" 
          placeholder="Author" 
          value={author} 
          onChange={e=>setAuthor(e.target.value)} 
          className="w-1/4 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button 
          type="submit" 
          disabled={posting}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25"
        >
          {posting ? '...' : 'Post'}
        </button>
      </form>
      
      {loading ? (
        <div className="grid gap-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {notes?.map(note => (
            <div key={note.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  N
                </div>
                <div>
                  <p className="font-bold text-slate-800">{note.title}</p>
                  <p className="text-xs text-slate-500">By {note.author} - {note.size || 'Unknown size'}</p>
                </div>
              </div>
              <button className="text-indigo-600 font-bold text-sm bg-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors">
                Download
              </button>
            </div>
          ))}
          {!notes?.length && (
            <p className="text-center text-slate-400 py-8">No notes shared yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  );
}
