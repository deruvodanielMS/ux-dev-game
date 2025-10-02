/* eslint-disable simple-import-sort/imports */
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { usePlayersContext } from '@/context/PlayersContext';
import { useMusicContext } from '@/hooks/useMusicContext';

import { AppFooter } from '@/components/organisms/AppFooter/AppFooter';
import { RequireAuth } from '@/components/organisms/AuthGate/RequireAuth';
import { Header } from '@/components/organisms/Header/Header';
import { Ladderboard } from '@/components/organisms/Ladderboard/Ladderboard';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { BattlePage } from '@/pages/BattlePage/BattlePage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage';
import { ProgressMapPage } from '@/pages/ProgressMapPage/ProgressMapPage';
// SelectPage deprecated -> replaced by DashboardPage
import { WelcomePage } from '@/pages/WelcomePage/WelcomePage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { GlobalLoadingOverlay } from '@/components/organisms/GlobalLoadingOverlay/GlobalLoadingOverlay';

import './App.css';

const RouteSyncer: React.FC = () => {
  const { state } = useGame();
  const { syncPlayer, refresh } = usePlayersContext();
  const loc = useLocation();
  const lastPathRef = React.useRef<string | null>(null);

  // Hook para cambio automático de música según la ruta
  useMusicContext();
  useEffect(() => {
    // Avoid spamming refresh if parent re-renders without path change
    if (lastPathRef.current === loc.pathname) return;
    lastPathRef.current = loc.pathname;
    const run = async () => {
      if (state.player?.id) {
        await syncPlayer(state.player.id);
      }
      // normal refresh (respects TTL) instead of forcing every time
      await refresh(false);
    };
    void run();
  }, [loc.pathname, state.player?.id, syncPlayer, refresh]);
  return null;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <RouteSyncer />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route path="/select" element={<DashboardPage />} />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AppFooter />
      <GlobalLoadingOverlay />
    </BrowserRouter>
  );
};
