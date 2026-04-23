import React, { useState, useRef, useEffect } from 'react';

const VideoRecorder = ({ studyId, studyTitle, onSave, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      releaseWakeLock();
    };
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      alert('카메라 접근 권한이 필요합니다.');
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.error('Wake Lock failed:', err);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  const startRecording = async () => {
    await requestWakeLock();
    chunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm';
    }
    
    const recorder = new MediaRecorder(stream, options);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      onSave(studyId, blob);
    };
    
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    releaseWakeLock();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>{studyTitle} 기록 중...</h2>
        
        <div style={{ 
          width: '100%', aspectRatio: '4/3', backgroundColor: '#000', 
          borderRadius: '16px', overflow: 'hidden', marginBottom: '20px',
          position: 'relative'
        }}>
          {!videoUrl ? (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <video src={videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          
          {recording && (
            <div style={{ 
              position: 'absolute', top: '20px', left: '20px', 
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.8)', padding: '4px 12px', borderRadius: '20px'
            }}>
              <div className="pulse" style={{ width: '10px', height: '10px', backgroundColor: 'white', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>REC</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!videoUrl ? (
            !recording ? (
              <button onClick={startRecording} className="btn btn-primary">녹화 시작</button>
            ) : (
              <button onClick={stopRecording} className="btn" style={{ backgroundColor: 'var(--danger)', color: 'white' }}>녹화 중지</button>
            )
          ) : (
            <>
              <button onClick={() => { setVideoUrl(null); startCamera(); }} className="btn">다시 찍기</button>
              <a 
                href={videoUrl} 
                download={`study-record-${studyId}.webm`} 
                className="btn" 
                style={{ backgroundColor: 'var(--success)', color: 'white', textDecoration: 'none' }}
              >
                다운로드
              </a>
            </>
          )}
          <button onClick={onClose} className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
