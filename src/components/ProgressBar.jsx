import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-container glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>오늘의 목표</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>학습 일정을 완료해 보세요!</p>
        </div>
        <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div style={{ 
        width: '100%', 
        height: '12px', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: '6px',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
        }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
