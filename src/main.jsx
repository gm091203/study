import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('App is initializing...');
window.onerror = function(msg, url, line, col, error) {
  console.error('Global Error caught:', msg, 'at', url, ':', line);
  return false;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
