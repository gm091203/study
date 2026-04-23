import React, { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar';
import StudyCard from './components/StudyCard';
import AddStudyModal from './components/AddStudyModal';
import { INITIAL_ROUTINE } from './data/routine';

function App() {
  const [studies, setStudies] = useState(() => {
    const saved = localStorage.getItem('study_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');
  const [lastNotified, setLastNotified] = useState({ id: null, type: null, time: null });

  // Request Notification Permission
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationsEnabled(permission === 'granted');
    if (permission === 'granted') {
      new Notification('알림이 설정되었습니다!', { body: '이제 공부 시간에 맞춰 알람을 보내드릴게요.' });
    }
  };

  // Alarm Sound
  const playAlarm = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  // Check for notifications every minute
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkTime = () => {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      
      studies.forEach(study => {
        // Start Time Notification
        if (study.startTime === currentTime && (lastNotified.id !== study.id || lastNotified.type !== 'start' || lastNotified.time !== currentTime)) {
          new Notification('📚 공부 시간이에요!', { body: `[${study.title}] 공부를 시작할 시간입니다.` });
          playAlarm();
          setLastNotified({ id: study.id, type: 'start', time: currentTime });
        }
        
        // End Time Notification
        if (study.endTime === currentTime && (lastNotified.id !== study.id || lastNotified.type !== 'end' || lastNotified.time !== currentTime)) {
          new Notification('☕ 고생하셨습니다!', { body: `[${study.title}] 시간이 끝났습니다. 잠시 쉬어보세요.` });
          playAlarm();
          setLastNotified({ id: study.id, type: 'end', time: currentTime });
        }
      });
    };

    const interval = setInterval(checkTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [studies, notificationsEnabled, lastNotified]);

  useEffect(() => {
    localStorage.setItem('study_sessions', JSON.stringify(studies));
  }, [studies]);

  const addStudy = (newStudy) => {
    setStudies([...studies, { ...newStudy, id: Date.now(), completed: false }]);
  };

  const toggleStudy = (id) => {
    setStudies(studies.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteStudy = (id) => {
    setStudies(studies.filter(s => s.id !== id));
  };

  const loadDefaultRoutine = () => {
    if (confirm('현재 일정을 모두 지우고 내 24시간 루틴을 불러올까요?')) {
      const routineWithNewIds = INITIAL_ROUTINE.map(item => ({
        ...item,
        id: Date.now() + Math.random()
      }));
      setStudies(routineWithNewIds);
    }
  };

  const completedCount = studies.filter(s => s.completed).length;
  const progressPercentage = studies.length > 0 ? (completedCount / studies.length) * 100 : 0;

  // Sort studies by start time, handling late night transition (after midnight)
  const sortedStudies = [...studies].sort((a, b) => {
    const getMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      let total = h * 60 + m;
      // If time is between 00:00 and 05:00, treat it as late night (add 24 hours)
      if (h < 5) total += 24 * 60;
      return total;
    };
    return getMinutes(a.startTime) - getMinutes(b.startTime);
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
            Study <span style={{ color: 'var(--accent-primary)' }}>Focus</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>오늘도 화이팅하세요!</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={requestPermission}
            className={`btn-icon ${notificationsEnabled ? 'active' : ''}`}
            style={{ 
              color: notificationsEnabled ? 'var(--success)' : 'var(--text-secondary)',
              backgroundColor: notificationsEnabled ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg)'
            }}
            title="알림 설정"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={notificationsEnabled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <ProgressBar percentage={progressPercentage} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600' }}>학습 일정</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={loadDefaultRoutine}
              style={{ 
                fontSize: '0.8rem', 
                padding: '4px 12px', 
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer'
              }}
            >
              내 루틴 불러오기
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {completedCount}/{studies.length} 완료
            </span>
          </div>
        </div>
        
        {sortedStudies.length > 0 ? (
          sortedStudies.map(study => (
            <StudyCard 
              key={study.id} 
              study={study} 
              onToggle={toggleStudy} 
              onDelete={deleteStudy} 
            />
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>아직 일정이 없습니다.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>+ 버튼을 눌러 공부 계획을 세워보세요!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddStudyModal 
          onAdd={addStudy} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
