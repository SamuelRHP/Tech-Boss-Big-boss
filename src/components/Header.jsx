import React, { useState, useEffect } from 'react';
import { useHouse } from '../context/HouseContext';
import { Radio, RefreshCw, Crown, ShieldAlert, Clock, Eye, AlertOctagon } from 'lucide-react';

export default function Header() {
  const { stats, resetDemoData, dangerZoneContestants } = useHouse();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleReset = () => {
    resetDemoData();
    setResetConfirmOpen(false);
  };

  return (
    <header className="bb-header">
      <div className="bb-header-glow"></div>
      <div className="bb-header-content">
        <div className="bb-header-left">
          <div className="bb-logo-wrapper">
            <div className="bb-eye-badge">
              <Eye className="bb-eye-icon animate-pulse" size={24} />
            </div>
            <div>
              <div className="bb-system-tag">SURVEILLANCE &amp; CONTROL SYSTEM // LEVEL 5 CLASSIFIED</div>
              <h1 className="bb-title">Tech House: Big Boss Command Center</h1>
            </div>
          </div>
        </div>

        <div className="bb-header-center">
          <div className="bb-status-pill live-pill">
            <span className="live-dot animate-ping-slow"></span>
            <Radio size={14} className="live-radio-icon" />
            <span className="live-text">LIVE FEED // TECH HOUSE</span>
          </div>

          <div className="bb-clock-pill">
            <Clock size={14} className="text-cyan-400" />
            <span className="bb-clock-time">{formattedTime}</span>
            <span className="bb-clock-date">{formattedDate}</span>
          </div>

          {dangerZoneContestants.length > 0 && (
            <div className="bb-danger-alert-pill animate-pulse">
              <AlertOctagon size={14} />
              <span>DANGER ZONE: {dangerZoneContestants.length} NOMINEES</span>
            </div>
          )}
        </div>

        <div className="bb-header-right">
          <div className="bb-captain-quick-info">
            <Crown size={15} className="text-amber-400" />
            <span className="text-xs text-slate-400">CAPTAIN:</span>
            <span className="text-xs font-bold text-amber-300">
              {stats.currentCaptain !== 'None' ? stats.currentCaptain : 'UNASSIGNED'}
            </span>
          </div>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="bb-btn bb-btn-secondary text-xs reset-btn"
            title="Restore default 10 contestants, tasks, and state"
          >
            <RefreshCw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Reset Demo Data */}
      {resetConfirmOpen && (
        <div className="bb-modal-overlay">
          <div className="bb-modal-box">
            <div className="bb-modal-header danger">
              <ShieldAlert size={22} className="text-red-400" />
              <h3>CONFIRM SYSTEM REBOOT</h3>
            </div>
            <p className="bb-modal-body text-slate-300 text-sm">
              Are you sure you want to <strong>Reset Demo Data</strong>? This will restore the 10 original housemates, reset all points, tasks, nominations, and announcements back to factory seed state.
            </p>
            <div className="bb-modal-actions">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="bb-btn bb-btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="bb-btn bb-btn-danger"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
