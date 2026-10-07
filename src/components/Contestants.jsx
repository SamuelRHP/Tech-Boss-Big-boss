import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import {
  Users,
  Plus,
  Minus,
  Edit,
  Trash2,
  Crown,
  ShieldCheck,
  AlertTriangle,
  UserX,
  Filter,
  Search,
  Coins,
} from 'lucide-react';

export default function Contestants({ onOpenAddModal, onOpenEditModal, onRequestEviction }) {
  const {
    contestants,
    adjustPoints,
    setCaptain,
    toggleNomination,
    toggleImmunity,
    removeContestant,
  } = useHouse();

  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Custom point input state by contestant id
  const [customPointsInput, setCustomPointsInput] = useState({});

  // Filter contestants (excluding Evicted in this main active roster; evicted has its own dedicated section)
  const activeContestants = contestants.filter((c) => c.status !== 'Evicted');

  const filtered = activeContestants.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = teamFilter === 'ALL' || c.team === teamFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const handleCustomPointChange = (id, val) => {
    setCustomPointsInput((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const applyCustomPoints = (id, multiplier = 1) => {
    const rawVal = customPointsInput[id];
    const amount = (Number(rawVal) || 0) * multiplier;
    if (amount !== 0) {
      adjustPoints(id, amount);
      setCustomPointsInput((prev) => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <section className="bb-card bb-section-contestants" id="contestant-management">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// PERSONNEL DOSSIER &amp; ROSTER</span>
          <h2 className="bb-section-title">Contestant Management</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="bb-btn bb-btn-primary"
            id="add-contestant-btn"
          >
            <Plus size={16} />
            <span>Add Contestant</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bb-roster-controls">
        <div className="bb-search-box">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search housemate by name or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bb-input search-input"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bb-select-wrap">
            <Filter size={13} className="bb-select-icon text-slate-400" />
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="bb-select"
            >
              <option value="ALL">All Teams</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI/ML">AI/ML</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <div className="bb-select-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bb-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Nominated">Nominated</option>
              <option value="Immune">Immune</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 ml-auto font-mono">
            Showing {filtered.length} of {activeContestants.length} active housemates
          </div>
        </div>
      </div>

      {/* Contestant Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bb-empty-state">
          <Users size={36} className="text-slate-600 mb-2" />
          <p className="text-slate-400">No housemates match the selected filters.</p>
        </div>
      ) : (
        <div className="bb-contestants-grid">
          {filtered.map((contestant) => {
            const isNominated = contestant.status === 'Nominated';
            const isImmune = contestant.status === 'Immune';
            const isCaptain = contestant.isCaptain;

            return (
              <div
                key={contestant.id}
                className={`bb-contestant-card ${isNominated ? 'card-danger' : ''} ${isImmune ? 'card-immune' : ''} ${isCaptain ? 'card-captain' : ''}`}
              >
                {/* Top Bar with Badges */}
                <div className="bb-card-topbar">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bb-team-badge">{contestant.team}</span>

                    {/* Status Badge */}
                    {isNominated && (
                      <span className="bb-badge bb-badge-danger">
                        <AlertTriangle size={11} /> Nominated
                      </span>
                    )}
                    {isImmune && (
                      <span className="bb-badge bb-badge-immune">
                        <ShieldCheck size={11} /> Immune
                      </span>
                    )}
                    {contestant.status === 'Active' && (
                      <span className="bb-badge bb-badge-active">
                        Active
                      </span>
                    )}

                    {/* Captain Badge (Feature 5: Captaincy) */}
                    {isCaptain && (
                      <span className="bb-badge bb-badge-captain" title="House Captain">
                        <Crown size={11} /> Captain
                      </span>
                    )}
                  </div>

                  {/* Edit / Remove actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditModal(contestant)}
                      className="bb-icon-btn edit-btn"
                      title="Edit Contestant details"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${contestant.name} from the system?`)) {
                          removeContestant(contestant.id);
                        }
                      }}
                      className="bb-icon-btn delete-btn"
                      title="Permanently remove contestant"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Main Identity */}
                <div className="bb-card-body">
                  <div className="bb-card-avatar-wrap">
                    <div className="bb-avatar-circle large">
                      {contestant.avatar || '👤'}
                    </div>
                    {isCaptain && (
                      <div className="bb-captain-crown-float" title="House Captain">
                        <Crown size={14} className="text-amber-400" />
                      </div>
                    )}
                  </div>

                  <div className="bb-card-identity">
                    <h3 className="bb-card-name">{contestant.name}</h3>
                    <div className="bb-card-meta">
                      ID: <span className="font-mono text-slate-400">{contestant.id}</span>
                    </div>
                  </div>
                </div>

                {/* Feature 4: Point System */}
                <div className="bb-point-system-box" id={`point-system-${contestant.id}`}>
                  <div className="bb-point-system-header">
                    <span className="bb-sub-label flex items-center gap-1">
                      <Coins size={12} className="text-cyan-400" />
                      <strong>Point System</strong>
                    </span>
                    <div className="bb-point-total font-mono">
                      <span className={`text-lg font-black ${contestant.points < 0 ? 'text-red-400' : 'text-cyan-300'}`}>
                        {contestant.points}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">pts</span>
                    </div>
                  </div>

                  {/* Quick & Custom Point Controls */}
                  <div className="bb-point-controls-row">
                    <div className="bb-quick-btn-group">
                      <button
                        onClick={() => adjustPoints(contestant.id, -10)}
                        className="bb-btn-point minus"
                        title="Deduct 10 points"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => adjustPoints(contestant.id, 10)}
                        className="bb-btn-point plus"
                        title="Add 10 points"
                      >
                        +10
                      </button>
                    </div>

                    <div className="bb-custom-point-wrap">
                      <input
                        type="number"
                        placeholder="Amt"
                        value={customPointsInput[contestant.id] || ''}
                        onChange={(e) => handleCustomPointChange(contestant.id, e.target.value)}
                        className="bb-input-sm w-16 text-center font-mono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') applyCustomPoints(contestant.id, 1);
                        }}
                      />
                      <button
                        onClick={() => applyCustomPoints(contestant.id, -1)}
                        className="bb-btn-point custom minus"
                        title="Deduct custom amount"
                      >
                        <Minus size={11} />
                      </button>
                      <button
                        onClick={() => applyCustomPoints(contestant.id, 1)}
                        className="bb-btn-point custom plus"
                        title="Add custom amount"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tactical Status Controls: Captaincy, Nominations, Immunity, Eviction */}
                <div className="bb-card-tactical-controls">
                  {/* Feature 5: Captaincy */}
                  <div className="bb-tactical-row">
                    <span className="bb-tactical-label">Captaincy:</span>
                    <button
                      onClick={() => setCaptain(contestant.id)}
                      className={`bb-btn bb-btn-sm ${isCaptain ? 'bb-btn-captain-active' : 'bb-btn-secondary'}`}
                      title={isCaptain ? 'Relinquish House Captain' : 'Promote to House Captain'}
                    >
                      <Crown size={12} />
                      <span>{isCaptain ? 'Demote Captain' : 'Make Captain'}</span>
                    </button>
                  </div>

                  {/* Feature 6: Nominations & Feature 7: Immunity */}
                  <div className="bb-tactical-row">
                    <span className="bb-tactical-label">Status:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Feature 7: Immunity Toggle */}
                      <button
                        onClick={() => toggleImmunity(contestant.id)}
                        className={`bb-btn bb-btn-sm ${isImmune ? 'bb-btn-immune-active' : 'bb-btn-secondary'}`}
                        title={isImmune ? 'Revoke Immunity' : 'Grant Immunity (Cancels nomination)'}
                      >
                        <ShieldCheck size={12} />
                        <span>{isImmune ? 'Remove Immunity' : 'Immunity'}</span>
                      </button>

                      {/* Feature 6: Nominations Toggle (Disabled when immune) */}
                      <div className="relative group inline-block">
                        <button
                          onClick={() => toggleNomination(contestant.id)}
                          disabled={isImmune}
                          className={`bb-btn bb-btn-sm ${isNominated ? 'bb-btn-danger' : 'bb-btn-secondary'} ${isImmune ? 'opacity-40 cursor-not-allowed' : ''}`}
                          title={isImmune ? 'Cannot nominate: Contestant is Immune' : isNominated ? 'Cancel Nomination' : 'Nominate Contestant'}
                        >
                          <AlertTriangle size={12} />
                          <span>{isNominated ? 'Nominated' : 'Nominate'}</span>
                        </button>

                        {/* Tooltip for Immune Contestant */}
                        {isImmune && (
                          <div className="bb-tooltip">
                            Cannot nominate: Contestant has Immunity!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Feature 12: Eviction Button */}
                  <div className="bb-tactical-row pt-1 border-t border-slate-800">
                    <span className="bb-tactical-label text-red-400">Eviction:</span>
                    <button
                      onClick={() => onRequestEviction(contestant)}
                      className="bb-btn bb-btn-sm bb-btn-danger-outline"
                      title="Evict contestant from Tech House"
                    >
                      <UserX size={12} />
                      <span>Evict Contestant</span>
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
