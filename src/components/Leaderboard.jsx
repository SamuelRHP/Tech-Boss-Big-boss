import React from 'react';
import { useHouse } from '../context/HouseContext';
import { Trophy, Crown, ShieldCheck, AlertTriangle, Plus, Minus, ArrowUpRight } from 'lucide-react';

export default function Leaderboard({ onSelectContestant }) {
  const { leaderboard, adjustPoints } = useHouse();

  return (
    <section className="bb-card bb-section-leaderboard" id="live-leaderboard">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// REAL-TIME RANKING ENGINE</span>
          <h2 className="bb-section-title">Live Leaderboard</h2>
        </div>
        <div className="bb-tag-gold flex items-center gap-1">
          <Trophy size={14} />
          <span>INSTANT RESORT</span>
        </div>
      </div>

      <div className="bb-leaderboard-notice text-xs text-slate-400 mb-3">
        * Ranked descending by points. Evicted contestants are excluded automatically. Re-sorts instantly upon score updates.
      </div>

      {leaderboard.length === 0 ? (
        <div className="bb-empty-state">
          <Trophy size={36} className="text-slate-600 mb-2" />
          <p className="text-slate-400">No active contestants on the board.</p>
        </div>
      ) : (
        <div className="bb-leaderboard-list">
          {leaderboard.map((contestant, index) => {
            const rank = index + 1;
            const isTop1 = rank === 1;
            const isTop2 = rank === 2;
            const isTop3 = rank === 3;

            let rankClass = 'rank-regular';
            if (isTop1) rankClass = 'rank-gold';
            else if (isTop2) rankClass = 'rank-silver';
            else if (isTop3) rankClass = 'rank-bronze';

            return (
              <div
                key={contestant.id}
                className={`bb-leaderboard-row ${rankClass} ${contestant.status === 'Nominated' ? 'row-nominated' : ''}`}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className="bb-leaderboard-rank">
                  <span className="rank-number">#{rank}</span>
                  {isTop1 && <Trophy size={16} className="text-amber-400 rank-trophy" />}
                </div>

                <div className="bb-contestant-avatar-cell">
                  <div className="bb-avatar-circle">
                    {contestant.avatar || '👤'}
                  </div>
                  {contestant.isCaptain && (
                    <div className="bb-captain-crown-badge" title="House Captain">
                      <Crown size={12} className="text-amber-400" />
                    </div>
                  )}
                </div>

                <div className="bb-contestant-details">
                  <div className="bb-name-row">
                    <span className="bb-contestant-name font-bold text-white">
                      {contestant.name}
                    </span>
                    {contestant.isCaptain && (
                      <span className="bb-badge bb-badge-captain">
                        <Crown size={11} /> CAPTAIN
                      </span>
                    )}
                    {contestant.status === 'Nominated' && (
                      <span className="bb-badge bb-badge-danger">
                        <AlertTriangle size={11} /> NOMINATED
                      </span>
                    )}
                    {contestant.status === 'Immune' && (
                      <span className="bb-badge bb-badge-immune">
                        <ShieldCheck size={11} /> IMMUNE
                      </span>
                    )}
                  </div>
                  <div className="bb-sub-row text-xs text-slate-400">
                    <span className="bb-team-tag">{contestant.team}</span>
                    <span className="text-slate-600">•</span>
                    <span>Status: <strong className="text-slate-300">{contestant.status}</strong></span>
                  </div>
                </div>

                <div className="bb-leaderboard-score">
                  <div className="bb-points-display font-mono">
                    <span className="text-lg font-black text-cyan-300">
                      {contestant.points}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">pts</span>
                  </div>

                  {/* Quick point modifiers */}
                  <div className="bb-quick-points">
                    <button
                      onClick={() => adjustPoints(contestant.id, -10)}
                      className="bb-point-btn minus"
                      title="Deduct 10 points"
                    >
                      <Minus size={12} />10
                    </button>
                    <button
                      onClick={() => adjustPoints(contestant.id, 10)}
                      className="bb-point-btn plus"
                      title="Add 10 points"
                    >
                      <Plus size={12} />10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
