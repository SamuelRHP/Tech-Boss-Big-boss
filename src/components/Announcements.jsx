import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { PRESET_ANNOUNCEMENTS } from '../data/seedData';
import {
  Megaphone,
  Radio,
  Send,
  Sparkles,
  History,
  Clock,
  Volume2,
} from 'lucide-react';

export default function Announcements() {
  const { announcements, broadcastAnnouncement } = useHouse();
  const [customMessage, setCustomMessage] = useState('');

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    broadcastAnnouncement(customMessage.trim());
    setCustomMessage('');
  };

  const handleSelectPreset = (presetText) => {
    broadcastAnnouncement(presetText);
  };

  return (
    <section className="bb-card bb-section-announcements" id="big-boss-announcement">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// VOICE OF COMMAND DISPATCH</span>
          <h2 className="bb-section-title">Big Boss Announcement</h2>
        </div>

        <div className="bb-tag-cyan flex items-center gap-1">
          <Radio size={14} className="animate-pulse" />
          <span>BROADCAST FREQUENCY 108.4</span>
        </div>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleBroadcast} className="bb-announcement-form mb-4">
        <div className="bb-form-group">
          <label className="bb-form-label flex items-center gap-1.5 text-xs">
            <Megaphone size={14} className="text-cyan-400" />
            <span>Transmit Official Big Boss Decree:</span>
          </label>
          <div className="bb-broadcast-input-row">
            <input
              type="text"
              placeholder="Type message to broadcast to all house screens & PA speakers..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="bb-input w-full"
            />
            <button
              type="submit"
              disabled={!customMessage.trim()}
              className="bb-btn bb-btn-primary flex-shrink-0"
              title="Broadcast to House"
            >
              <Send size={15} />
              <span>Broadcast</span>
            </button>
          </div>
        </div>
      </form>

      {/* Preset Announcements */}
      <div className="bb-presets-section mb-5">
        <div className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1">
          <Sparkles size={13} className="text-amber-400" />
          <span>QUICK PRESET ANNOUNCEMENTS (CLICK TO TRANSMIT):</span>
        </div>
        <div className="bb-presets-cloud">
          {PRESET_ANNOUNCEMENTS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleSelectPreset(preset)}
              className="bb-preset-chip"
              title="Broadcast this preset immediately"
            >
              <Volume2 size={12} className="text-cyan-400" />
              <span>"{preset}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Announcement History List */}
      <div className="bb-history-section">
        <div className="bb-history-header text-xs text-slate-400 font-semibold mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <History size={13} className="text-slate-400" />
            <span>BROADCAST TRANSMISSION LOG ({announcements.length})</span>
          </span>
          <span className="font-mono text-slate-500 text-[11px]">ALL LOGS PRESERVED</span>
        </div>

        {announcements.length === 0 ? (
          <div className="bb-empty-state text-xs text-slate-500">
            No announcements broadcasted yet.
          </div>
        ) : (
          <div className="bb-announcement-history-list">
            {announcements.map((item) => (
              <div key={item.id} className="bb-history-item">
                <div className="bb-history-timestamp font-mono">
                  <Clock size={11} className="text-cyan-400" />
                  <span>{item.timestamp}</span>
                </div>
                <div className="bb-history-msg">
                  <span className="bb-boss-prefix">BIG BOSS:</span>
                  <span className="text-slate-200"> {item.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
