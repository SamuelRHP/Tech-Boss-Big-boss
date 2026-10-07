import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_CONTESTANTS,
  INITIAL_TASKS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/seedData';

const HouseContext = createContext(null);

const STORAGE_KEY = 'TECH_HOUSE_BIG_BOSS_STATE_V1';

export function HouseProvider({ children }) {
  // Load initial state from localStorage or fall back to seed data
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.contestants && parsed.tasks && parsed.announcements) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage:', e);
    }
    return {
      contestants: INITIAL_CONTESTANTS,
      tasks: INITIAL_TASKS,
      announcements: INITIAL_ANNOUNCEMENTS,
    };
  });

  // Current active broadcast banner/modal (temporary alert)
  const [currentBroadcast, setCurrentBroadcast] = useState(null);

  // Sync state to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  // Reset to initial seed data
  const resetDemoData = () => {
    const freshState = {
      contestants: INITIAL_CONTESTANTS,
      tasks: INITIAL_TASKS,
      announcements: INITIAL_ANNOUNCEMENTS,
    };
    setState(freshState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    } catch (e) {
      console.error('Failed to reset localStorage:', e);
    }
    broadcastAnnouncement('SYSTEM RESET: Seed data restored by Big Boss Command.');
  };

  // Contestant actions
  const addContestant = ({ name, team, points = 0, avatar = '👤' }) => {
    const newContestant = {
      id: 'c_' + Date.now(),
      name: name.trim(),
      team: team || 'Frontend',
      points: Number(points) || 0,
      status: 'Active',
      avatar: avatar.trim() || '👤',
      isCaptain: false,
    };
    setState((prev) => ({
      ...prev,
      contestants: [newContestant, ...prev.contestants],
    }));
  };

  const updateContestant = (id, updates) => {
    setState((prev) => ({
      ...prev,
      contestants: prev.contestants.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          ...updates,
          points: updates.points !== undefined ? Number(updates.points) || 0 : c.points,
        };
      }),
    }));
  };

  const removeContestant = (id) => {
    setState((prev) => ({
      ...prev,
      contestants: prev.contestants.filter((c) => c.id !== id),
      // Also unassign or clean up tasks assigned to this contestant
      tasks: prev.tasks.map((t) => (t.assignedToId === id ? { ...t, assignedToId: '' } : t)),
    }));
  };

  // Adjust points (can be positive or negative; points never crash if negative)
  const adjustPoints = (id, amount) => {
    const delta = Number(amount) || 0;
    if (delta === 0) return;

    setState((prev) => ({
      ...prev,
      contestants: prev.contestants.map((c) => {
        if (c.id !== id) return c;
        const newPoints = (Number(c.points) || 0) + delta;
        return { ...c, points: newPoints };
      }),
    }));
  };

  // Set or change Captaincy (only 1 captain at a time; evicted cannot be captain)
  const setCaptain = (id) => {
    setState((prev) => {
      const target = prev.contestants.find((c) => c.id === id);
      if (!target || target.status === 'Evicted') return prev;

      const isAlreadyCaptain = target.isCaptain;

      return {
        ...prev,
        contestants: prev.contestants.map((c) => ({
          ...c,
          isCaptain: c.id === id ? !isAlreadyCaptain : false,
        })),
      };
    });
  };

  // Nominations: Toggle on/off. Immune contestants CANNOT be nominated. Evicted cannot be nominated.
  const toggleNomination = (id) => {
    setState((prev) => {
      const target = prev.contestants.find((c) => c.id === id);
      if (!target || target.status === 'Evicted' || target.status === 'Immune') {
        return prev;
      }

      const nextStatus = target.status === 'Nominated' ? 'Active' : 'Nominated';
      return {
        ...prev,
        contestants: prev.contestants.map((c) =>
          c.id === id ? { ...c, status: nextStatus } : c
        ),
      };
    });
  };

  // Immunity: Grant/remove immunity. If a nominated contestant is granted immunity, remove nomination!
  const toggleImmunity = (id) => {
    setState((prev) => {
      const target = prev.contestants.find((c) => c.id === id);
      if (!target || target.status === 'Evicted') return prev;

      let nextStatus = 'Active';
      if (target.status !== 'Immune') {
        nextStatus = 'Immune'; // granting immunity cancels nomination if present!
      }

      return {
        ...prev,
        contestants: prev.contestants.map((c) =>
          c.id === id ? { ...c, status: nextStatus } : c
        ),
      };
    });
  };

  // Eviction: Evicted contestants removed from active house/leaderboard.
  // Evicted contestants cannot be nominated, assigned tasks, or made captain.
  // If evicted was captain, clear captaincy!
  const evictContestant = (id) => {
    setState((prev) => {
      const target = prev.contestants.find((c) => c.id === id);
      if (!target) return prev;

      return {
        ...prev,
        contestants: prev.contestants.map((c) => {
          if (c.id !== id) return c;
          return {
            ...c,
            status: 'Evicted',
            isCaptain: false, // captaincy cleared
            evictedAt: new Date().toISOString(),
          };
        }),
      };
    });

    const evictedContestant = state.contestants.find((c) => c.id === id);
    if (evictedContestant) {
      broadcastAnnouncement(`EVICTION NOTICE: ${evictedContestant.name} has been evicted from the Tech House!`);
    }
  };

  // Reinstate contestant (optional recovery)
  const reinstateContestant = (id) => {
    setState((prev) => ({
      ...prev,
      contestants: prev.contestants.map((c) =>
        c.id === id ? { ...c, status: 'Active', evictedAt: null } : c
      ),
    }));
  };

  // Task Management
  const createTask = ({ title, description, pointsReward, assignedToId }) => {
    const newTask = {
      id: 't_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      pointsReward: Number(pointsReward) || 0,
      assignedToId: assignedToId || '',
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  // Completing a task automatically awards its points to the assigned contestant
  const toggleTaskComplete = (taskId) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const willBeCompleted = !task.completed;
      const reward = Number(task.pointsReward) || 0;
      const assignedId = task.assignedToId;

      // Update task
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: willBeCompleted,
              completedAt: willBeCompleted ? new Date().toISOString() : null,
            }
          : t
      );

      // Automatically award or revert points to assigned contestant if assigned
      let updatedContestants = prev.contestants;
      if (assignedId && reward !== 0) {
        updatedContestants = prev.contestants.map((c) => {
          if (c.id !== assignedId) return c;
          const delta = willBeCompleted ? reward : -reward;
          return {
            ...c,
            points: (Number(c.points) || 0) + delta,
          };
        });
      }

      return {
        ...prev,
        tasks: updatedTasks,
        contestants: updatedContestants,
      };
    });
  };

  const deleteTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Big Boss Announcement
  const broadcastAnnouncement = (message) => {
    if (!message || !message.trim()) return;
    const trimmed = message.trim();
    const newAnnouncement = {
      id: 'a_' + Date.now(),
      message: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString(),
    };

    setState((prev) => ({
      ...prev,
      announcements: [newAnnouncement, ...prev.announcements],
    }));

    setCurrentBroadcast({
      id: newAnnouncement.id,
      message: trimmed,
      timestamp: newAnnouncement.timestamp,
    });
  };

  const dismissBroadcast = () => {
    setCurrentBroadcast(null);
  };

  // Computed House Statistics (Feature 11)
  const stats = useMemo(() => {
    const all = state.contestants;
    const activeAndNonEvicted = all.filter((c) => c.status !== 'Evicted');
    const evicted = all.filter((c) => c.status === 'Evicted');
    const nominees = all.filter((c) => c.status === 'Nominated');
    const immune = all.filter((c) => c.status === 'Immune');
    const activeContestants = all.filter((c) => c.status === 'Active');
    const captain = all.find((c) => c.isCaptain && c.status !== 'Evicted');

    const totalPoints = all.reduce((sum, c) => sum + (Number(c.points) || 0), 0);

    // Highest and lowest scorers (from non-evicted contestants if available, else all)
    const poolForScorers = activeAndNonEvicted.length > 0 ? activeAndNonEvicted : all;
    let highestScorer = null;
    let lowestScorer = null;

    if (poolForScorers.length > 0) {
      const sortedByPoints = [...poolForScorers].sort((a, b) => b.points - a.points);
      highestScorer = sortedByPoints[0];
      lowestScorer = sortedByPoints[sortedByPoints.length - 1];
    }

    const tasksCompleted = state.tasks.filter((t) => t.completed).length;
    const tasksPending = state.tasks.filter((t) => !t.completed).length;

    return {
      highestScorer,
      lowestScorer,
      totalPoints,
      tasksCompleted,
      tasksPending,
      numberOfNominees: nominees.length,
      numberOfImmune: immune.length,
      currentCaptain: captain ? captain.name : 'None',
      captainObject: captain || null,
      numberEvicted: evicted.length,
      numberOfActive: activeContestants.length,
      totalContestants: all.length,
      nonEvictedTotal: activeAndNonEvicted.length,
    };
  }, [state.contestants, state.tasks]);

  // Leaderboard data: ranked descending by points, evicted contestants are NOT shown (Feature 2)
  const leaderboard = useMemo(() => {
    return state.contestants
      .filter((c) => c.status !== 'Evicted')
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return a.name.localeCompare(b.name);
      });
  }, [state.contestants]);

  // Danger Zone data: all currently nominated contestants (Feature 8)
  const dangerZoneContestants = useMemo(() => {
    return state.contestants.filter((c) => c.status === 'Nominated');
  }, [state.contestants]);

  // Evicted contestants list (Feature 12)
  const evictedContestants = useMemo(() => {
    return state.contestants.filter((c) => c.status === 'Evicted');
  }, [state.contestants]);

  const value = {
    contestants: state.contestants,
    tasks: state.tasks,
    announcements: state.announcements,
    currentBroadcast,
    stats,
    leaderboard,
    dangerZoneContestants,
    evictedContestants,
    addContestant,
    updateContestant,
    removeContestant,
    adjustPoints,
    setCaptain,
    toggleNomination,
    toggleImmunity,
    evictContestant,
    reinstateContestant,
    createTask,
    toggleTaskComplete,
    deleteTask,
    broadcastAnnouncement,
    dismissBroadcast,
    resetDemoData,
  };

  return <HouseContext.Provider value={value}>{children}</HouseContext.Provider>;
}

export function useHouse() {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
}
