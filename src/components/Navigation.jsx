import React from 'react';
import {
  LayoutDashboard,
  Users,
  Trophy,
  CheckSquare,
  AlertTriangle,
  Timer,
  BarChart3,
  Megaphone,
  UserX,
} from 'lucide-react';
import { useHouse } from '../context/HouseContext';

export default function Navigation({ activeTab, setActiveTab }) {
  const { dangerZoneContestants, stats } = useHouse();

  const navItems = [
    { id: 'all', label: 'Full Command Deck', icon: LayoutDashboard },
    { id: 'contestants', label: 'Contestant Management', icon: Users, badge: stats.numberOfActive },
    { id: 'leaderboard', label: 'Live Leaderboard', icon: Trophy },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare, badge: stats.tasksPending },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, badge: dangerZoneContestants.length, isDanger: true },
    { id: 'timer', label: 'Task Timer', icon: Timer },
    { id: 'stats', label: 'House Statistics', icon: BarChart3 },
    { id: 'announcements', label: 'Big Boss Announcement', icon: Megaphone },
    { id: 'evicted', label: 'Eviction', icon: UserX, badge: stats.numberEvicted },
  ];

  return (
    <nav className="bb-navigation">
      <div className="bb-nav-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`bb-nav-btn ${isActive ? 'active' : ''} ${item.isDanger && item.badge > 0 ? 'danger-alert' : ''}`}
            >
              <Icon size={16} className="bb-nav-icon" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`bb-nav-badge ${item.isDanger && item.badge > 0 ? 'danger-badge' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
