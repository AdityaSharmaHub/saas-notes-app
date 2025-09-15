'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { notesApi, tenantsApi, handleApiError } from '../../lib/api';
import { Plus, Edit3, Trash2, Crown, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create/Edit Note Modal State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [noteLoading, setNoteLoading] = useState(false);
  
  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getAll();
      setNotes(data.notes || []);
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
    setShowNoteModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setShowNoteModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    setNoteLoading(true);
    setError('');

    try {
      if (editingNote) {
        // Update existing note
        const updated = await notesApi.update(editingNote.id, noteForm);
        setNotes(notes.map(note => note.id === editingNote.id ? updated : note));
        setSuccess('Note updated successfully!');
      } else {
        // Create new note
        const created = await notesApi.create(noteForm);
        setNotes([created, ...notes]);
        setSuccess('Note created successfully!');
      }
      
      setShowNoteModal(false);
      setNoteForm({ title: '', content: '' });
      setEditingNote(null);
    } catch (err) {
      const error = handleApiError(err);
      
      // Check if it's a subscription limit error
      if (error.status === 403 && error.message.includes('Subscription limit')) {
        setShowUpgradeModal(true);
        setShowNoteModal(false);
      } else {
        setError(error.message);
      }
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesApi.delete(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      setSuccess('Note deleted successfully!');
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await tenantsApi.upgrade(user.tenant.slug);
      await refreshUser(); // Refresh user data to get updated subscription
      setSuccess('Successfully upgraded to Pro! You can now create unlimited notes.');
      setShowUpgradeModal(false);
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    } finally {
      setUpgrading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const isFreePlan = user?.tenant?.subscription === 'free';
  const isAtLimit = isFreePlan && notes.length >= 3;

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button onClick={clearMessages} className="ml-auto text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 border border-green-300 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <button onClick={clearMessages} className="ml-auto text-green-400 hover:text-green-600">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            {isFreePlan && (
              <span className="ml-2 text-sm text-gray-500">
                ({notes.length}/3 used on Free plan)
              </span>
            )}
          </p>
        </div>
        
        <button
          onClick={handleCreateNote}
          disabled={isAtLimit}
          className={`btn-primary ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isAtLimit ? 'Upgrade to Pro for unlimited notes' : 'Create new note'}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Note
        </button>
      </div>

      {/* Upgrade Banner for Free Users at Limit */}
      {isAtLimit && user.role === 'admin' && (
        <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-medium text-yellow-900">Upgrade to Pro</h3>
                <p className="text-yellow-700">You've reached the 3-note limit. Upgrade for unlimited notes!</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="btn-primary bg-yellow-600 hover:bg-yellow-700"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Edit3 className="h-12 w-12" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first note.</p>
          <button
            onClick={handleCreateNote}
            disabled={isAtLimit}
            className="btn-primary mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="card">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate flex-1">
                    {note.title}
                  </h3>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      title="Edit note"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="capitalize">{note.user.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h3>
              
              <form onSubmit={handleSaveNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="200"
                    className="input-field"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    placeholder="Enter note title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    required
                    rows="6"
                    maxLength="10000"
                    className="input-field"
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    placeholder="Write your note content here..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {noteForm.content.length}/10,000 characters
                  </p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={noteLoading}
                    className="btn-primary flex-1"
                  >
                    {noteLoading ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <Crown className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upgrade to Pro
              </h3>
              <p className="text-gray-600 mb-6">
                You've reached the 3-note limit on the Free plan. Upgrade to Pro for unlimited notes!
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading || user.role !== 'admin'}
                  className="btn-primary flex-1"
                >
                  {upgrading ? 'Upgrading...' : 'Upgrade to Pro'}
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
              
              {user.role !== 'admin' && (
                <p className="text-xs text-gray-500 mt-3">
                  Only admins can upgrade subscriptions
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}