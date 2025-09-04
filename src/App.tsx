import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import HomePage from './pages/HomePage/HomePage';
import ProfileSetupPage from './pages/ProfileSetupPage/ProfileSetupPage';
import BattlePage from './pages/BattlePage/BattlePage';
import ProgressMapPage from './pages/ProgressMapPage/ProgressMapPage';
import Header from './components/organisms/Header/Header';
import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="app-root">
          <Header />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfileSetupPage />} />
            <Route path="/battle" element={<BattlePage />} />
            <Route path="/progress" element={<ProgressMapPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
