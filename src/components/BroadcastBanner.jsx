import React from 'react';
import { useHouse } from '../context/HouseContext';
import { Megaphone, X, Volume2, Radio } from 'lucide-react';

export default function BroadcastBanner() {
  const { currentBroadcast, dismissBroadcast } = useHouse();

  if (!currentBroadcast) return null;

  return (
    <div className="bb-broadcast-banner-wrapper">
      <div className="bb-broadcast-banner">
        <div className="bb-broadcast-signal-icon">
          <Radio size={20} className="text-cyan-400 animate-pulse" />
        </div>

        <div className="bb-broadcast-text-content">
          <div className="bb-broadcast-header-line">
            <span className="bb-broadcast-tag">PRIORITY TRANSMISSION // BIG BOSS DIRECTIVE</span>
            <span className="bb-broadcast-time font-mono text-[11px] text-cyan-300">
              [{currentBroadcast.timestamp}]
            </span>
          </div>
          <div className="bb-broadcast-message">
            "{currentBroadcast.message}"
          </div>
        </div>

        <button
          onClick={dismissBroadcast}
          className="bb-broadcast-dismiss-btn"
          title="Dismiss Announcement Banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
