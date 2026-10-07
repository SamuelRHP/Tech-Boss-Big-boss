import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  BellRing,
  Volume2,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function TaskTimer() {
  const [initialMinutes, setInitialMinutes] = useState(5);
  const [initialSeconds, setInitialSeconds] = useState(0);

  const [timeLeft, setTimeLeft] = useState(5 * 60); // total seconds remaining
  const [isRunning, setIsRunning] = useState(false);
  const [isTimesUp, setIsTimesUp] = useState(false);

  // Keep track of target finish time for drift-free countdown
  const timerRef = useRef(null);

  // Sync timeLeft when user changes initial minutes or seconds while not running
  const updateInitialDuration = (newMin, newSec) => {
    const m = Math.max(0, parseInt(newMin, 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(newSec, 10) || 0));
    setInitialMinutes(m);
    setInitialSeconds(s);
    if (!isRunning) {
      setTimeLeft(m * 60 + s);
      setIsTimesUp(false);
    }
  };

  const setPreset = (mins, secs = 0) => {
    setIsRunning(false);
    setInitialMinutes(mins);
    setInitialSeconds(secs);
    setTimeLeft(mins * 60 + secs);
    setIsTimesUp(false);
  };

  // Safe setInterval with cleanup
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsTimesUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    if (timeLeft <= 0) {
      // If at zero, reset to initial duration first
      const total = initialMinutes * 60 + initialSeconds;
      if (total <= 0) return;
      setTimeLeft(total);
      setIsTimesUp(false);
    }
    setIsTimesUp(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60 + initialSeconds);
    setIsTimesUp(false);
  };

  // Formatted display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUnderTenSeconds = timeLeft > 0 && timeLeft <= 10;
  const isZero = timeLeft === 0;

  // Percentage for progress ring / bar
  const totalDuration = Math.max(1, initialMinutes * 60 + initialSeconds);
  const progressPercent = Math.min(100, Math.max(0, (timeLeft / totalDuration) * 100));

  return (
    <section className="bb-card bb-section-timer" id="task-timer">
      <div className="bb-section-header">
        <div className="bb-section-title-wrap">
          <span className="bb-section-subtitle">// CHRONOMETER ENGINE</span>
          <h2 className="bb-section-title">Task Timer</h2>
        </div>

        <div className={`bb-tag ${isUnderTenSeconds ? 'bb-tag-red animate-pulse' : isTimesUp ? 'bb-tag-red' : 'bb-tag-cyan'}`}>
          {isTimesUp ? 'TIME EXPIRED' : isUnderTenSeconds ? 'CRITICAL TIME' : isRunning ? 'TIMER RUNNING' : 'STANDBY'}
        </div>
      </div>

      <div className="bb-timer-container">
        {/* Visual warning for under 10 seconds */}
        {isUnderTenSeconds && (
          <div className="bb-timer-warning-banner animate-bounce-slow">
            <AlertTriangle size={16} />
            <span>CRITICAL WARNING: LESS THAN 10 SECONDS REMAINING!</span>
          </div>
        )}

        {/* Time's up alert modal / banner */}
        {isTimesUp && (
          <div className="bb-timer-alert-box animate-pulse">
            <BellRing size={24} className="text-red-400" />
            <div>
              <h4 className="font-bold text-red-400 text-sm">TIME'S UP! CHALLENGE WINDOW CLOSED!</h4>
              <p className="text-xs text-red-200">Big Boss announces all work must cease immediately.</p>
            </div>
            <button
              onClick={() => setIsTimesUp(false)}
              className="bb-btn bb-btn-sm bb-btn-danger ml-auto"
            >
              Acknowledge
            </button>
          </div>
        )}

        {/* Main Countdown Display */}
        <div className={`bb-timer-digital-wrap ${isUnderTenSeconds ? 'warning-glow' : ''} ${isTimesUp ? 'expired-glow' : ''}`}>
          <div className="bb-digital-clock font-mono">
            <span className="digital-digits">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className={`digital-colon ${isRunning ? 'animate-pulse' : ''}`}>:</span>
            <span className="digital-digits">
              {String(seconds).padStart(2, '0')}
            </span>
          </div>

          <div className="bb-timer-progress-bar">
            <div
              className={`bb-timer-progress-fill ${isUnderTenSeconds ? 'bg-red-500' : 'bg-cyan-400'}`}
              style={{ width: `${progressPercent}%`, transition: 'width 1s linear' }}
            ></div>
          </div>
        </div>

        {/* Controls: Start, Pause, Reset */}
        <div className="bb-timer-controls">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bb-btn bb-btn-primary timer-action-btn"
              title="Start countdown"
            >
              <Play size={16} />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bb-btn bb-btn-warning timer-action-btn"
              title="Pause countdown"
            >
              <Pause size={16} />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="bb-btn bb-btn-secondary timer-action-btn"
            title="Reset to configured duration"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Configuration: Configurable duration (minutes / seconds) */}
        <div className="bb-timer-config-box">
          <div className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1">
            <Clock size={13} className="text-cyan-400" />
            <span>CONFIGURE DURATION</span>
          </div>

          <div className="bb-timer-inputs-row">
            <div className="flex items-center gap-1">
              <label className="text-xs text-slate-400">Min:</label>
              <input
                type="number"
                min="0"
                max="180"
                value={initialMinutes}
                onChange={(e) => updateInitialDuration(e.target.value, initialSeconds)}
                className="bb-input-sm w-16 text-center font-mono"
                disabled={isRunning}
              />
            </div>

            <div className="flex items-center gap-1">
              <label className="text-xs text-slate-400">Sec:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={initialSeconds}
                onChange={(e) => updateInitialDuration(initialMinutes, e.target.value)}
                className="bb-input-sm w-16 text-center font-mono"
                disabled={isRunning}
              />
            </div>

            {/* Quick Presets */}
            <div className="bb-timer-presets ml-auto flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-slate-500 mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => setPreset(0, 15)}
                className="bb-preset-btn text-[11px]"
                disabled={isRunning}
                title="15 seconds (quick test for 10s warning & zero alert)"
              >
                15s (Test)
              </button>
              <button
                type="button"
                onClick={() => setPreset(1, 0)}
                className="bb-preset-btn text-[11px]"
                disabled={isRunning}
              >
                1m
              </button>
              <button
                type="button"
                onClick={() => setPreset(5, 0)}
                className="bb-preset-btn text-[11px]"
                disabled={isRunning}
              >
                5m
              </button>
              <button
                type="button"
                onClick={() => setPreset(15, 0)}
                className="bb-preset-btn text-[11px]"
                disabled={isRunning}
              >
                15m
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
