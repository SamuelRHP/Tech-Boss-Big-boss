import React from 'react';
import { ArrowDownRight, ArrowRight, Crown, Radio, ShieldAlert, Users } from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import './CommandHero.css';

export default function CommandHero({ setActiveTab }) {
  const { stats, dangerZoneContestants } = useHouse();

  return (
    <section className="command-hero" aria-labelledby="command-hero-title">
      <div className="command-hero-copy">
        <div className="command-hero-kicker">
          <span className="command-hero-live-dot" />
          The house is live <span>·</span> Command view
        </div>
        <h1 id="command-hero-title">
          Every move<br />
          <span className="command-hero-highlight">counts here.</span>
        </h1>
        <p className="command-hero-description">
          The people, points and pressure of the Tech House, all in one place. Keep the game moving.
        </p>
        <div className="command-hero-actions">
          <button className="command-hero-primary" onClick={() => setActiveTab('contestants')}>
            Manage the house <ArrowRight size={17} />
          </button>
          <button className="command-hero-secondary" onClick={() => setActiveTab('leaderboard')}>
            See the leaderboard <ArrowDownRight size={16} />
          </button>
        </div>
        <div className="command-hero-metrics" aria-label="Current house summary">
          <div><strong>{stats.numberOfActive}</strong><span>active housemates</span></div>
          <div><strong>{stats.tasksPending}</strong><span>tasks in play</span></div>
          <div><strong>{stats.totalPoints.toLocaleString()}</strong><span>points earned</span></div>
        </div>
      </div>

      <div className="command-hero-art" aria-label="Live Tech House overview">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-art-caption"><Radio size={13} /> LIVE HOUSE / 01</div>
        <div className="hero-house-mark" aria-hidden="true">
          <span className="hero-mark-roof" />
          <span className="hero-mark-body"><span /><span /><span /></span>
        </div>
        <div className="hero-float-card hero-nominee-card">
          <span className="hero-float-icon"><ShieldAlert size={16} /></span>
          <span><small>In the danger zone</small><strong>{dangerZoneContestants.length} nominated</strong></span>
          <span className="hero-float-arrow">↗</span>
        </div>
        <div className="hero-float-card hero-captain-card">
          <span className="hero-captain-icon"><Crown size={16} /></span>
          <span><small>House captain</small><strong>{stats.currentCaptain === 'None' ? 'Not assigned' : stats.currentCaptain}</strong></span>
        </div>
        <div className="hero-art-stamp"><Users size={15} /><span>{stats.nonEvictedTotal} IN THE HOUSE</span></div>
      </div>
    </section>
  );
}