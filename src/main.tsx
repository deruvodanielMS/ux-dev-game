import { StrictMode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createRoot } from 'react-dom/client';

import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ModalProvider } from '@/context/ModalContext';
import { ToastProvider } from '@/context/ToastContext';

import './index.css';

import { App } from '@/App';

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ModalProvider>
        {domain && clientId ? (
          <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{ redirect_uri: window.location.origin }}
          >
            <AuthProvider>
              <GameProvider>
                <AudioProvider>
                  <App />
                </AudioProvider>
              </GameProvider>
            </AuthProvider>
          </Auth0Provider>
        ) : (
          // Fallback without Auth0: provide only non-auth providers
          <GameProvider>
            <AudioProvider>
              <App />
            </AudioProvider>
          </GameProvider>
        )}
      </ModalProvider>
    </ToastProvider>
  </StrictMode>,
);
