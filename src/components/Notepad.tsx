import { useState, useEffect } from 'react';
import { Edit3, Check, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function Notepad() {
  const [notes, setNotes] = useState<any[]>([]);
  const [activeNote, setActiveNote] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const parsedUser = JSON.parse(userStr);
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await api.get(`/notes/${parsedUser._id || parsedUser.id}`, config);
      if (res.data.success) {
        setNotes(res.data.notes);
        if (res.data.notes.length > 0 && !activeNote) {
          setActiveNote(res.data.notes[0]);
          setTitle(res.data.notes[0].title);
          setContent(res.data.notes[0].content);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNote = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const parsedUser = JSON.parse(userStr);
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await api.post('/notes', { 
        title: 'Untitled Note', 
        content: 'New Note', 
        userId: parsedUser._id || parsedUser.id 
      }, config);
      
      if (res.data.success) {
        setNotes([res.data.note, ...notes]);
        setActiveNote(res.data.note);
        setTitle('Untitled Note');
        setContent('New Note');
      }
    } catch (err) {
      toast.error('Failed to create note');
    }
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await api.put(`/notes/${activeNote._id}`, { title, content }, config);
      toast.success('Note saved');
      setNotes(notes.map(n => n._id === activeNote._id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n));
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await api.delete(`/notes/${id}`, config);
      const newNotes = notes.filter(n => n._id !== id);
      setNotes(newNotes);
      if (activeNote?._id === id) {
        if (newNotes.length > 0) {
          setActiveNote(newNotes[0]);
          setTitle(newNotes[0].title);
          setContent(newNotes[0].content);
        } else {
          setActiveNote(null);
          setTitle('');
          setContent('');
        }
      }
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5DED6] shadow-sm flex flex-col h-[400px]">
      <div className="flex items-center justify-between p-4 border-b border-[#E5DED6] bg-[#F6F3EE] rounded-t-xl">
        <h2 className="text-lg font-semibold text-[#1F2937] flex items-center">
          <Edit3 className="w-4 h-4 mr-2" /> Private Notepad
        </h2>
        <div className="flex items-center space-x-2">
          {activeNote && (
            <button onClick={handleSaveNote} disabled={isSaving} className="text-[#2563EB] hover:bg-blue-50 p-1 rounded transition-colors text-xs font-medium flex items-center">
               <Check className="w-3 h-3 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
          <button onClick={handleCreateNote} className="text-[#6B7280] hover:text-[#2563EB] p-1 rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Note List Sidebar */}
        <div className="w-1/3 border-r border-[#E5DED6] overflow-y-auto bg-gray-50/50">
          {notes.length === 0 ? (
            <div className="p-4 text-xs text-[#6B7280] text-center">No notes yet. Click + to create one.</div>
          ) : (
            notes.map(note => (
              <div 
                key={note._id} 
                onClick={() => { setActiveNote(note); setTitle(note.title); setContent(note.content); }}
                className={`p-3 border-b border-[#E5DED6] cursor-pointer hover:bg-white transition-colors flex justify-between group flex-col ${activeNote?._id === note._id ? 'bg-white border-l-2 border-l-[#2563EB]' : ''}`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className="truncate text-sm font-semibold text-[#1F2937] flex-1 pr-2">
                    {note.title || 'Untitled Note'}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}
                    className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="truncate text-xs text-[#6B7280] w-full mt-1">
                  {note.content ? note.content.substring(0, 25) : 'Empty Note'}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Note Editor */}
        <div className="flex-1 p-4 bg-white flex flex-col">
          {activeNote ? (
            <>
              <input 
                type="text"
                className="w-full text-lg font-bold text-[#1F2937] outline-none mb-3 border-b border-transparent focus:border-[#E5DED6] pb-2 transition-colors"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveNote}
              />
              <textarea
                className="w-full flex-1 resize-none outline-none text-[#1F2937] text-sm leading-relaxed"
                placeholder="Start typing your private notes here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSaveNote}
              ></textarea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-[#6B7280] text-sm">
              Select or create a note.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
