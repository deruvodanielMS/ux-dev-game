import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppFooter } from '@/components/organisms/AppFooter/AppFooter';
import { RequireAuth } from '@/components/organisms/AuthGate/RequireAuth';
import { Header } from '@/components/organisms/Header/Header';
import { Ladderboard } from '@/components/organisms/Ladderboard/Ladderboard';
import { BattlePage } from '@/pages/BattlePage/BattlePage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage';
import { ProgressMapPage } from '@/pages/ProgressMapPage/ProgressMapPage';
import { WelcomePage } from '@/pages/WelcomePage/WelcomePage';

import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';

import './App.css';

export const App = () => {
  return (
    <AuthProvider>
      <AudioProvider>
        <BrowserRouter>
          <div className="app-root">
            <Header />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <ProfileSetupPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/battle"
                element={
                  <RequireAuth>
                    <BattlePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/progress"
                element={
                  <RequireAuth>
                    <ProgressMapPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/ladder"
                element={
                  <RequireAuth>
                    <Ladderboard />
                  </RequireAuth>
                }
              />
            </Routes>
            <AppFooter />
          </div>
        </BrowserRouter>
      </AudioProvider>
    </AuthProvider>
  );
};
