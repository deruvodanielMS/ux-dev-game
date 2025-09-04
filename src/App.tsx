import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import ProfileSetupPage from './pages/ProfileSetupPage/ProfileSetupPage';
import BattlePage from './pages/BattlePage/BattlePage';
import ProgressMapPage from './pages/ProgressMapPage/ProgressMapPage';
import Header from './components/organisms/Header/Header';
import AppFooter from './components/organisms/AppFooter/AppFooter';
import Ladderboard from './components/organisms/Ladderboard/Ladderboard';
import { PlayerProvider } from './context/PlayerContext';
import { ModalProvider } from './context/ModalContext';
import { ToastProvider } from './context/ToastContext';
import { AudioProvider } from './context/AudioContext';

function App() {
  return (
    <PlayerProvider>
      <ToastProvider>
        <AudioProvider>
          <ModalProvider>
            <BrowserRouter>
              <div className="app-root">
                <Header />
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/profile" element={<ProfileSetupPage />} />
                  <Route path="/battle" element={<BattlePage />} />
                  <Route path="/progress" element={<ProgressMapPage />} />
                </Routes>
                <AppFooter />
              </div>
            </BrowserRouter>
          </ModalProvider>
        </AudioProvider>
      </ToastProvider>
    </PlayerProvider>
  );
}

export default App;
