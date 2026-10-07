import React from 'react';
import { useHouse } from '../context/HouseContext';
import { UserX, AlertTriangle, Crown, ShieldAlert, X } from 'lucide-react';

export default function EvictionConfirmModal({ contestant, onClose }) {
  const { evictContestant } = useHouse();

  if (!contestant) return null;

  const handleConfirm = () => {
    evictContestant(contestant.id);
    onClose();
  };

  return (
    <div className="bb-modal-overlay">
      <div className="bb-modal-box border-red-600/80">
        <div className="bb-modal-header danger">
          <div className="flex items-center gap-2">
            <ShieldAlert size={22} className="text-red-500 animate-pulse" />
            <h3 className="text-red-400">OFFICIAL EVICTION ORDER</h3>
          </div>
          <button onClick={onClose} className="bb-icon-btn">
            <X size={18} />
          </button>
        </div>

        <div className="bb-eviction-modal-content">
          <div className="bb-eviction-target-card">
            <div className="bb-avatar-circle large danger-avatar">
              {contestant.avatar || '👤'}
            </div>
            <div className="bb-eviction-target-info">
              <h4 className="text-lg font-bold text-white">{contestant.name}</h4>
              <p className="text-xs text-slate-400">
                Team: <span className="text-red-300 font-semibold">{contestant.team}</span> | Points: <span className="text-cyan-300 font-mono font-bold">{contestant.points}</span>
              </p>
              {contestant.isCaptain && (
                <div className="text-xs text-amber-300 flex items-center gap-1 mt-1">
                  <Crown size={12} />
                  <span>Holds current House Captaincy (will be revoked)</span>
                </div>
              )}
            </div>
          </div>

          <div className="bb-eviction-warning-list text-xs text-slate-300 mt-3 space-y-1 bg-red-950/20 p-3 rounded border border-red-900/60">
            <div className="font-bold text-red-400 flex items-center gap-1">
              <AlertTriangle size={14} /> CONSEQUENCES OF EVICTION:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>Permanently removed from active House population.</li>
              <li>Excluded from the <strong>Live Leaderboard</strong>.</li>
              <li>Cannot be nominated or granted immunity.</li>
              <li>Cannot be assigned new tasks or appointed Captain.</li>
              <li>Moved to the official <strong>Evicted</strong> archive.</li>
            </ul>
          </div>
        </div>

        <div className="bb-modal-actions mt-5">
          <button type="button" onClick={onClose} className="bb-btn bb-btn-ghost">
            Cancel Order
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bb-btn bb-btn-danger"
          >
            <UserX size={14} />
            Confirm Eviction
          </button>
        </div>
      </div>
    </div>
  );
}
