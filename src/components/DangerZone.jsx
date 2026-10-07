import React from 'react';
import { useHouse } from '../context/HouseContext';
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  UserX,
  ShieldAlert,
  Crown,
  CheckCircle2,
} from 'lucide-react';

export default function DangerZone({ onRequestEviction }) {
  const {
    dangerZoneContestants,
    toggleNomination,
    toggleImmunity,
  } = useHouse();

  return (
    <section className="bb-card bb-section-danger-zone" id="danger-zone">
      <div className="bb-section-header danger-header">
        <div className="bb-section-title-wrap">
          <div className="bb-danger-siren-label">
            <span className="bb-danger-dot animate-ping"></span>
            <span className="bb-section-subtitle text-red-400">// CODE RED SURVEILLANCE</span>
          </div>
          <h2 className="bb-section-title text-red-500 flex items-center gap-2">
            <AlertTriangle className="text-red-500 animate-bounce-slow" size={24} />
            Danger Zone
          </h2>
        </div>
        <div className="bb-tag-red">
          {dangerZoneContestants.length} NOMINEES AT RISK
        </div>
      </div>

      <p className="text-xs text-red-300/80 mb-4 font-mono">
        WARNING: Contestants in the Danger Zone are officially nominated for eviction by Big Boss.
      </p>

      {dangerZoneContestants.length === 0 ? (
        <div className="bb-danger-empty-state">
          <div className="bb-safe-shield-icon">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h3 className="text-emerald-300 font-bold text-base mt-2">HOUSE IS SECURE</h3>
          <p className="text-slate-400 text-xs mt-1">
            No contestants are currently in the Danger Zone. All active housemates are safe from eviction.
          </p>
        </div>
      ) : (
        <div className="bb-danger-grid">
          {dangerZoneContestants.map((contestant) => (
            <div key={contestant.id} className="bb-danger-card">
              <div className="bb-danger-card-glow"></div>
              <div className="bb-danger-card-top">
                <div className="bb-danger-avatar-wrap">
                  <div className="bb-avatar-circle danger-avatar">
                    {contestant.avatar || '👤'}
                  </div>
                  {contestant.isCaptain && (
                    <div className="bb-captain-crown-badge">
                      <Crown size={12} className="text-amber-400" />
                    </div>
                  )}
                </div>

                <div className="bb-danger-info">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-base">
                      {contestant.name}
                    </span>
                    {contestant.isCaptain && (
                      <span className="bb-badge bb-badge-captain text-[10px]">
                        <Crown size={10} /> CAPTAIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <span className="text-red-300 font-semibold">{contestant.team}</span>
                    <span className="text-slate-600 mx-1.5">•</span>
                    <span className="font-mono text-cyan-300 font-bold">{contestant.points} pts</span>
                  </div>
                </div>

                <div className="bb-danger-badge-flag">
                  <Flame size={14} className="text-red-400" />
                  <span>ON THE BLOCK</span>
                </div>
              </div>

              <div className="bb-danger-actions">
                <button
                  onClick={() => toggleNomination(contestant.id)}
                  className="bb-btn bb-btn-secondary text-xs"
                  title="Remove from Danger Zone"
                >
                  Revoke Nomination
                </button>

                <button
                  onClick={() => toggleImmunity(contestant.id)}
                  className="bb-btn bb-btn-immune text-xs"
                  title="Grant immunity (automatically clears nomination)"
                >
                  <ShieldCheck size={13} /> Grant Immunity
                </button>

                <button
                  onClick={() => onRequestEviction(contestant)}
                  className="bb-btn bb-btn-danger text-xs evict-btn"
                  title="Evict contestant from Tech House"
                >
                  <UserX size={13} /> Evict Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
