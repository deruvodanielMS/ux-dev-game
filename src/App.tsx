import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppFooter } from '@/components/organisms/AppFooter/AppFooter';
import { Header } from '@/components/organisms/Header/Header';
import { Ladderboard } from '@/components/organisms/Ladderboard/Ladderboard';
import { BattlePage } from '@/pages/BattlePage/BattlePage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage';
import { ProgressMapPage } from '@/pages/ProgressMapPage/ProgressMapPage';
import { WelcomePage } from '@/pages/WelcomePage/WelcomePage';

import { AudioProvider } from '@/context/AudioContext';

import './App.css';

export const App = () => {
  return (
    <AudioProvider>
      <BrowserRouter>
        <div className="app-root">
          <Header />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/profile" element={<ProfileSetupPage />} />
            <Route path="/battle" element={<BattlePage />} />
            <Route path="/progress" element={<ProgressMapPage />} />
            <Route path="/ladder" element={<Ladderboard />} />
          </Routes>
          <AppFooter />
        </div>
      </BrowserRouter>
    </AudioProvider>
  );
};
