/* eslint-disable simple-import-sort/imports */
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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

import './App.css';

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
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
    </BrowserRouter>
  );
};
