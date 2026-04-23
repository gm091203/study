import React from 'react';

const StudyCard = ({ study, onToggle, onDelete }) => {
  return (
    <div className={`study-card glass-panel animate-fade-in ${study.completed ? 'completed' : ''}`} style={{
      padding: '20px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      transition: 'all 0.3s ease',
      opacity: study.completed ? 0.7 : 1,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div 
        onClick={() => onToggle(study.id)}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          border: `2px solid ${study.completed ? 'var(--success)' : 'var(--glass-border)'}`,
          backgroundColor: study.completed ? 'var(--success)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        {study.completed && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: '600', 
            color: 'var(--accent-secondary)',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            {study.startTime} - {study.endTime}
          </span>
        </div>
        <h3 style={{ 
          fontSize: '1.1rem', 
          fontWeight: '600',
          textDecoration: study.completed ? 'line-through' : 'none',
          color: study.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
        }}>
          {study.title}
        </h3>
      </div>

      <button 
        onClick={() => onDelete(study.id)}
        className="btn-icon"
        style={{ color: 'var(--danger)', borderColor: 'transparent' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>

      {study.completed && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: 'var(--success)'
        }} />
      )}
    </div>
  );
};

export default StudyCard;
