import React from 'react';
import { useHouse } from '../context/HouseContext';
import { UserX, Undo2, Skull, Calendar, ShieldX } from 'lucide-react';

export default function EvictedList() {
  const { evictedContestants, reinstateContestant } = useHouse();

  return (
    <section className="bb-card bb-section-evicted" id="eviction">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// DE-ACTIVATED PERSONNEL ARCHIVE</span>
          <h2 className="bb-section-title text-slate-300 flex items-center gap-2">
            <UserX size={20} className="text-red-400" />
            Eviction
          </h2>
        </div>

        <div className="bb-tag-gray font-mono">
          {evictedContestants.length} EVICTED CONTESTANTS
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Evicted contestants are permanently stripped of active House status and excluded from the Live Leaderboard. They cannot be nominated, assigned tasks, or appointed House Captain.
      </p>

      {evictedContestants.length === 0 ? (
        <div className="bb-empty-state">
          <ShieldX size={36} className="text-slate-600 mb-2" />
          <p className="text-slate-400 font-medium">No contestants have been evicted.</p>
          <p className="text-slate-500 text-xs mt-1">All active housemates remain inside the Tech House.</p>
        </div>
      ) : (
        <div className="bb-evicted-grid">
          {evictedContestants.map((contestant) => (
            <div key={contestant.id} className="bb-evicted-card">
              <div className="bb-evicted-top">
                <div className="bb-avatar-circle evicted-avatar">
                  {contestant.avatar || '👤'}
                </div>
                <div className="bb-evicted-info">
                  <h4 className="bb-evicted-name font-bold line-through text-slate-400">
                    {contestant.name}
                  </h4>
                  <div className="text-xs text-slate-500">
                    <span>{contestant.team}</span>
                    <span className="mx-1.5">•</span>
                    <span className="font-mono">{contestant.points} pts at exit</span>
                  </div>
                </div>
                <div className="bb-evicted-tag">
                  <Skull size={13} className="text-red-400" />
                  <span>EVICTED</span>
                </div>
              </div>

              {contestant.evictedAt && (
                <div className="bb-evicted-date text-[11px] text-slate-500 flex items-center gap-1 mt-2">
                  <Calendar size={11} />
                  <span>Evicted on: {new Date(contestant.evictedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              )}

              <div className="bb-evicted-actions mt-3 pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    if (window.confirm(`Reinstate ${contestant.name} back to Active status in the Tech House?`)) {
                      reinstateContestant(contestant.id);
                    }
                  }}
                  className="bb-btn bb-btn-secondary text-xs flex items-center gap-1"
                  title="Reinstate contestant back to the Tech House"
                >
                  <Undo2 size={12} />
                  <span>Pardon &amp; Reinstate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
