import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  User,
  Coins,
  Crown,
} from 'lucide-react';

export default function Tasks() {
  const {
    tasks,
    contestants,
    createTask,
    toggleTaskComplete,
    deleteTask,
  } = useHouse();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed'
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsReward, setPointsReward] = useState('25');
  const [assignedToId, setAssignedToId] = useState('');
  const [formError, setFormError] = useState('');

  // Non-evicted contestants can be assigned tasks
  const eligibleAssignees = contestants.filter((c) => c.status !== 'Evicted');

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const displayedTasks =
    activeTab === 'pending'
      ? pendingTasks
      : activeTab === 'completed'
      ? completedTasks
      : tasks;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }
    const reward = Number(pointsReward);
    if (isNaN(reward) || reward <= 0) {
      setFormError('Please enter a valid positive points reward.');
      return;
    }

    createTask({
      title,
      description,
      pointsReward: reward,
      assignedToId,
    });

    setTitle('');
    setDescription('');
    setPointsReward('25');
    setAssignedToId('');
    setFormError('');
    setShowCreateForm(false);
  };

  return (
    <section className="bb-card bb-section-tasks" id="task-management">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// DIRECTIVE &amp; CHALLENGE DISPATCHER</span>
          <h2 className="bb-section-title">Task Management</h2>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bb-btn bb-btn-primary"
        >
          <Plus size={16} />
          <span>{showCreateForm ? 'Cancel Directive' : 'Assign New Task'}</span>
        </button>
      </div>

      {/* Create Task Modal / Drawer */}
      {showCreateForm && (
        <form onSubmit={handleCreateTask} className="bb-task-form">
          <div className="bb-form-title">CREATE HOUSE DIRECTIVE</div>

          {formError && (
            <div className="bb-form-error text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800 mb-3">
              {formError}
            </div>
          )}

          <div className="bb-form-grid">
            <div className="bb-form-group">
              <label className="bb-form-label">Task Title *</label>
              <input
                type="text"
                placeholder="e.g. Master the Quantum Algorithm Challenge"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bb-input"
                required
              />
            </div>

            <div className="bb-form-group">
              <label className="bb-form-label">Points Reward *</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 30"
                value={pointsReward}
                onChange={(e) => setPointsReward(e.target.value)}
                className="bb-input font-mono"
                required
              />
            </div>

            <div className="bb-form-group">
              <label className="bb-form-label">Assign To Housemate (Non-Evicted)</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="bb-select w-full"
              >
                <option value="">-- Unassigned (Open Pool) --</option>
                {eligibleAssignees.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.team}) {c.isCaptain ? '★ Captain' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bb-form-group mt-3">
            <label className="bb-form-label">Description / Instructions</label>
            <textarea
              rows={2}
              placeholder="Detail the parameters and deliverables of this challenge..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bb-input"
            />
          </div>

          <div className="bb-form-actions mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bb-btn bb-btn-ghost text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="bb-btn bb-btn-primary text-xs">
              Deploy Task to House
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs: All, Pending, Completed */}
      <div className="bb-task-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`bb-task-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`bb-task-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
        >
          <Clock size={13} />
          Pending Tasks ({pendingTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`bb-task-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
        >
          <CheckCircle2 size={13} />
          Completed Tasks ({completedTasks.length})
        </button>
      </div>

      {/* Task List */}
      {displayedTasks.length === 0 ? (
        <div className="bb-empty-state">
          <CheckSquare size={36} className="text-slate-600 mb-2" />
          <p className="text-slate-400">No tasks in this category.</p>
        </div>
      ) : (
        <div className="bb-task-list">
          {displayedTasks.map((task) => {
            const assignee = contestants.find((c) => c.id === task.assignedToId);

            return (
              <div
                key={task.id}
                className={`bb-task-card ${task.completed ? 'task-completed' : 'task-pending'}`}
              >
                <div className="bb-task-check-wrap">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="bb-task-checkbox"
                    id={`task-check-${task.id}`}
                    title={
                      task.completed
                        ? 'Click to mark pending (deducts reward points)'
                        : 'Click to mark completed (awards points immediately)'
                    }
                  />
                </div>

                <div className="bb-task-content">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`bb-task-title ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h4>

                    {task.completed ? (
                      <span className="bb-badge bb-badge-completed">
                        <CheckCircle2 size={11} /> COMPLETED (+{task.pointsReward} PTS AWARDED)
                      </span>
                    ) : (
                      <span className="bb-badge bb-badge-pending">
                        <Clock size={11} /> PENDING
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="bb-task-desc text-xs text-slate-400 mt-1">
                      {task.description}
                    </p>
                  )}

                  <div className="bb-task-meta text-xs text-slate-400 mt-2 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-cyan-300 font-bold">
                      <Coins size={12} className="text-amber-400" />
                      +{task.pointsReward} Points
                    </span>

                    <span className="text-slate-600">•</span>

                    <span className="flex items-center gap-1">
                      <User size={12} className="text-slate-400" />
                      {assignee ? (
                        <span className="text-slate-200 font-medium flex items-center gap-1">
                          Assigned to: <strong>{assignee.name}</strong>
                          {assignee.isCaptain && <Crown size={11} className="text-amber-400" />}
                          {assignee.status === 'Evicted' && (
                            <span className="text-red-400 font-mono text-[10px]">(Evicted)</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned (Open pool)</span>
                      )}
                    </span>

                    {task.completedAt && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 text-[11px]">
                          Finished: {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bb-task-actions">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`bb-btn bb-btn-sm ${task.completed ? 'bb-btn-secondary' : 'bb-btn-primary'}`}
                    title={task.completed ? 'Mark Pending' : 'Mark Complete (Awards Points)'}
                  >
                    {task.completed ? 'Reopen' : 'Complete'}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bb-icon-btn delete-btn"
                    title="Delete task"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
