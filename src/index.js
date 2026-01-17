import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import './styles/Auth.css';
import './styles/Layout.css';
import './styles/Dashboard.css';
import './styles/Components.css';
import './styles/Profile.css';  // ✅ Add this
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);