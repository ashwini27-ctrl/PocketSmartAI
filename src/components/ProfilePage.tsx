import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Edit2,
  Check,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (view: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout, updateProfileName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setStatusMessage({ type: 'error', text: 'Name cannot be blank.' });
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    const res = await updateProfileName(newName.trim());
    setIsSaving(false);
    if (res.success) {
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Profile name updated successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to update name.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold font-display shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  {user?.name || 'User Profile'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Account Details Form */}
        <div className="pt-6 space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Account Information
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewName(user?.name || '');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-sm font-medium text-slate-800">{user?.name}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Name</span>
                  </button>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 flex items-center justify-between">
                <span>{user?.email}</span>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Verified
                </span>
              </div>
            </div>

            {/* Created At */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Creation Date</label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{user?.createdAt ? formatDate(user.createdAt) : 'January 2026'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Preferences & Security Card */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Budget Security & Guarantees
          </h3>
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Strict Budget Constraint Policy</span>
            </div>
            <p className="text-blue-800/80 leading-relaxed">
              Every plan generated by PocketSmart AI enforces your spending cap. Recommendation algorithms automatically scale item allocations so your expenses never cross your designated limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
