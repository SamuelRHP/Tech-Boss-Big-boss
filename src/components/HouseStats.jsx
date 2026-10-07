import React from 'react';
import { useHouse } from '../context/HouseContext';
import {
  Trophy,
  TrendingDown,
  Coins,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Crown,
  UserX,
  Users,
} from 'lucide-react';

export default function HouseStats() {
  const { stats } = useHouse();

  return (
    <section className="bb-card bb-section-stats" id="house-statistics">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// REAL-TIME TELEMETRY</span>
          <h2 className="bb-section-title">House Statistics</h2>
        </div>
        <div className="bb-tag-cyan">LIVE COMPUTED</div>
      </div>

      <div className="bb-stats-grid">
        {/* Highest Scorer */}
        <div className="bb-stat-box gold-border">
          <div className="bb-stat-icon-wrap gold">
            <Trophy size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Highest Scorer</div>
            <div className="bb-stat-value text-amber-300">
              {stats.highestScorer ? stats.highestScorer.name : 'N/A'}
            </div>
            <div className="bb-stat-sub">
              {stats.highestScorer ? `${stats.highestScorer.points} Points (${stats.highestScorer.team})` : '0 Pts'}
            </div>
          </div>
        </div>

        {/* Lowest Scorer */}
        <div className="bb-stat-box orange-border">
          <div className="bb-stat-icon-wrap orange">
            <TrendingDown size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Lowest Scorer</div>
            <div className="bb-stat-value text-orange-400">
              {stats.lowestScorer ? stats.lowestScorer.name : 'N/A'}
            </div>
            <div className="bb-stat-sub">
              {stats.lowestScorer ? `${stats.lowestScorer.points} Points (${stats.lowestScorer.team})` : '0 Pts'}
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="bb-stat-box cyan-border">
          <div className="bb-stat-icon-wrap cyan">
            <Coins size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Total Points</div>
            <div className="bb-stat-value text-cyan-300 font-mono">
              {stats.totalPoints.toLocaleString()}
            </div>
            <div className="bb-stat-sub">Across all housemates</div>
          </div>
        </div>

        {/* Current Captain */}
        <div className="bb-stat-box amber-border">
          <div className="bb-stat-icon-wrap amber">
            <Crown size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Current Captain</div>
            <div className="bb-stat-value text-amber-300">
              {stats.currentCaptain}
            </div>
            <div className="bb-stat-sub">
              {stats.captainObject ? `Team ${stats.captainObject.team}` : 'No Captain Designated'}
            </div>
          </div>
        </div>

        {/* Tasks Completed / Pending */}
        <div className="bb-stat-box blue-border">
          <div className="bb-stat-icon-wrap blue">
            <CheckCircle2 size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Tasks Completed / Pending</div>
            <div className="bb-stat-value text-blue-300 font-mono">
              {stats.tasksCompleted} <span className="text-slate-500 font-normal">/</span> {stats.tasksPending}
            </div>
            <div className="bb-stat-sub">
              {stats.tasksCompleted + stats.tasksPending} Total Tasks In System
            </div>
          </div>
        </div>

        {/* Number of Nominees */}
        <div className="bb-stat-box red-border">
          <div className="bb-stat-icon-wrap red">
            <AlertTriangle size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Number of Nominees</div>
            <div className="bb-stat-value text-red-400 font-mono">
              {stats.numberOfNominees}
            </div>
            <div className="bb-stat-sub">In Danger Zone</div>
          </div>
        </div>

        {/* Number of Immune Contestants */}
        <div className="bb-stat-box emerald-border">
          <div className="bb-stat-icon-wrap emerald">
            <ShieldCheck size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Number of Immune Contestants</div>
            <div className="bb-stat-value text-emerald-300 font-mono">
              {stats.numberOfImmune}
            </div>
            <div className="bb-stat-sub">Protected from nomination</div>
          </div>
        </div>

        {/* Number of Active Contestants */}
        <div className="bb-stat-box slate-border">
          <div className="bb-stat-icon-wrap slate">
            <Users size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Number of Active Contestants</div>
            <div className="bb-stat-value text-cyan-400 font-mono">
              {stats.numberOfActive}
            </div>
            <div className="bb-stat-sub">{stats.nonEvictedTotal} In the House</div>
          </div>
        </div>

        {/* Number Evicted */}
        <div className="bb-stat-box gray-border">
          <div className="bb-stat-icon-wrap gray">
            <UserX size={20} />
          </div>
          <div className="bb-stat-info">
            <div className="bb-stat-label">Number Evicted</div>
            <div className="bb-stat-value text-slate-400 font-mono">
              {stats.numberEvicted}
            </div>
            <div className="bb-stat-sub">Permanent House Exits</div>
          </div>
        </div>
      </div>
    </section>
  );
}
