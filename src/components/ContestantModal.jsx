import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { TEAMS } from '../data/seedData';
import { UserPlus, UserCheck, X } from 'lucide-react';

const EMOJI_OPTIONS = ['⚡', '🤖', '🚀', '💻', '🧠', '🌐', '🛡️', '🐧', '⚙️', '🔥', '🎯', '✨'];

function ContestantForm({ editingContestant, onClose }) {
  const { addContestant, updateContestant } = useHouse();

  const [name, setName] = useState(editingContestant ? editingContestant.name : '');
  const [team, setTeam] = useState(editingContestant ? editingContestant.team : 'Frontend');
  const [points, setPoints] = useState(editingContestant ? String(editingContestant.points) : '100');
  const [avatar, setAvatar] = useState(editingContestant ? (editingContestant.avatar || '⚡') : '⚡');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Contestant name is required.');
      return;
    }

    const numericPoints = Number(points);
    if (isNaN(numericPoints)) {
      setError('Points must be a valid number.');
      return;
    }

    if (editingContestant) {
      updateContestant(editingContestant.id, {
        name: name.trim(),
        team,
        points: numericPoints,
        avatar: avatar.trim() || '👤',
      });
    } else {
      addContestant({
        name: name.trim(),
        team,
        points: numericPoints,
        avatar: avatar.trim() || '👤',
      });
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bb-modal-form">
      {error && (
        <div className="bb-form-error text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800 mb-3">
          {error}
        </div>
      )}

      <div className="bb-form-group">
        <label className="bb-form-label">Full Name *</label>
        <input
          type="text"
          placeholder="e.g. Katherine Johnson"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bb-input"
          autoFocus
          required
        />
      </div>

      <div className="bb-form-grid">
        <div className="bb-form-group">
          <label className="bb-form-label">Specialization Team *</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="bb-select w-full"
          >
            {TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="bb-form-group">
          <label className="bb-form-label">Initial Points *</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="bb-input font-mono"
            required
          />
        </div>
      </div>

      <div className="bb-form-group mt-3">
        <label className="bb-form-label">Avatar Emoji or Symbol</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="bb-input w-24 text-center font-bold text-lg"
            placeholder="⚡"
          />
          <span className="text-xs text-slate-400">Pick below or type custom initials/emoji:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              type="button"
              key={emoji}
              onClick={() => setAvatar(emoji)}
              className={`bb-avatar-picker-btn ${avatar === emoji ? 'active' : ''}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="bb-modal-actions mt-5">
        <button type="button" onClick={onClose} className="bb-btn bb-btn-ghost">
          Cancel
        </button>
        <button type="submit" className="bb-btn bb-btn-primary">
          {editingContestant ? 'Save Changes' : 'Enroll Contestant'}
        </button>
      </div>
    </form>
  );
}

export default function ContestantModal({ isOpen, onClose, editingContestant }) {
  if (!isOpen) return null;

  return (
    <div className="bb-modal-overlay">
      <div className="bb-modal-box">
        <div className="bb-modal-header">
          <div className="flex items-center gap-2">
            {editingContestant ? (
              <UserCheck size={20} className="text-cyan-400" />
            ) : (
              <UserPlus size={20} className="text-cyan-400" />
            )}
            <h3>{editingContestant ? 'EDIT HOUSEMATE DOSSIER' : 'ENROLL NEW HOUSEMATE'}</h3>
          </div>
          <button onClick={onClose} className="bb-icon-btn">
            <X size={18} />
          </button>
        </div>

        <ContestantForm
          key={editingContestant ? editingContestant.id : 'new'}
          editingContestant={editingContestant}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
