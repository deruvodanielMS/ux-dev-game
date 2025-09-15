import { StrictMode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { AudioProvider } from './context/AudioContext';
import { GameProvider } from './context/GameContext';
import { ModalProvider } from './context/ModalContext';
import { ToastProvider } from './context/ToastContext';

import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ModalProvider>
        <GameProvider>
          <AudioProvider>
            {domain && clientId ? (
              <Auth0Provider
                domain={domain}
                clientId={clientId}
                authorizationParams={{ redirect_uri: window.location.origin }}
              >
                <App />
              </Auth0Provider>
            ) : (
              <App />
            )}
          </AudioProvider>
        </GameProvider>
      </ModalProvider>
    </ToastProvider>
  </StrictMode>,
);
