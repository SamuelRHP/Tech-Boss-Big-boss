import React, { useState } from 'react';
import { HouseProvider } from './context/HouseContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BroadcastBanner from './components/BroadcastBanner';
import HouseStats from './components/HouseStats';
import Leaderboard from './components/Leaderboard';
import DangerZone from './components/DangerZone';
import Contestants from './components/Contestants';
import Tasks from './components/Tasks';
import TaskTimer from './components/TaskTimer';
import Announcements from './components/Announcements';
import EvictedList from './components/EvictedList';
import ContestantModal from './components/ContestantModal';
import EvictionConfirmModal from './components/EvictionConfirmModal';

function MainCommandCenter() {
  const [activeTab, setActiveTab] = useState('all');

  // Modal states
  const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
  const [editingContestant, setEditingContestant] = useState(null);
  const [evictingContestant, setEvictingContestant] = useState(null);

  const handleOpenAddModal = () => {
    setEditingContestant(null);
    setIsContestantModalOpen(true);
  };

  const handleOpenEditModal = (contestant) => {
    setEditingContestant(contestant);
    setIsContestantModalOpen(true);
  };

  const handleRequestEviction = (contestant) => {
    setEvictingContestant(contestant);
  };

  return (
    <div className="bb-command-center">
      {/* Background Grid & Scanline FX */}
      <div className="bb-bg-grid"></div>
      <div className="bb-scanlines"></div>

      {/* Top Header */}
      <Header />

      {/* Live Broadcast Banner */}
      <BroadcastBanner />

      {/* Top Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="bb-main-content">
        {/* Full Command Deck View */}
        {activeTab === 'all' && (
          <div className="bb-deck-container">
            {/* Feature 11: House Statistics */}
            <div className="bb-deck-row">
              <HouseStats />
            </div>

            {/* Feature 8: Danger Zone (High Visibility) */}
            <div className="bb-deck-row">
              <DangerZone onRequestEviction={handleRequestEviction} />
            </div>

            {/* Dual Column: Leaderboard + Quick Ops (Timer & Announcements) */}
            <div className="bb-deck-two-col">
              <div className="bb-deck-col">
                {/* Feature 2: Live Leaderboard */}
                <Leaderboard />
              </div>

              <div className="bb-deck-col space-y-5">
                {/* Feature 10: Task Timer */}
                <TaskTimer />

                {/* Feature 9: Big Boss Announcement */}
                <Announcements />
              </div>
            </div>

            {/* Feature 1: Contestant Management (includes Point System, Captaincy, Nominations, Immunity) */}
            <div className="bb-deck-row">
              <Contestants
                onOpenAddModal={handleOpenAddModal}
                onOpenEditModal={handleOpenEditModal}
                onRequestEviction={handleRequestEviction}
              />
            </div>

            {/* Feature 3: Task Management */}
            <div className="bb-deck-row">
              <Tasks />
            </div>

            {/* Feature 12: Eviction */}
            <div className="bb-deck-row">
              <EvictedList />
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'contestants' && (
          <Contestants
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onRequestEviction={handleRequestEviction}
          />
        )}

        {activeTab === 'leaderboard' && <Leaderboard />}

        {activeTab === 'tasks' && <Tasks />}

        {activeTab === 'danger' && (
          <DangerZone onRequestEviction={handleRequestEviction} />
        )}

        {activeTab === 'timer' && <TaskTimer />}

        {activeTab === 'stats' && <HouseStats />}

        {activeTab === 'announcements' && <Announcements />}

        {activeTab === 'evicted' && <EvictedList />}
      </main>

      {/* Modals */}
      <ContestantModal
        isOpen={isContestantModalOpen}
        onClose={() => setIsContestantModalOpen(false)}
        editingContestant={editingContestant}
      />

      <EvictionConfirmModal
        contestant={evictingContestant}
        onClose={() => setEvictingContestant(null)}
      />

      {/* Footer */}
      <footer className="bb-footer">
        <div className="bb-footer-content">
          <span>TECH HOUSE // BIG BOSS COMMAND CENTER v2.4</span>
          <span className="text-slate-600">•</span>
          <span>AUTONOMOUS SURVEILLANCE &amp; POINTS TELEMETRY</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400">STATUS: NOMINAL</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HouseProvider>
      <MainCommandCenter />
    </HouseProvider>
  );
}
