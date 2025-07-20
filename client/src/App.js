import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            <h1>DHL Survey Dashboard</h1>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;