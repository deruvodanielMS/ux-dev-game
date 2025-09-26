import { StrictMode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { createRoot } from 'react-dom/client';

import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ModalProvider } from '@/context/ModalContext';
import { NetworkActivityProvider } from '@/context/NetworkActivityContext';
import { PlayersProvider } from '@/context/PlayersContext';
import { ToastProvider } from '@/context/ToastContext';

import './index.css';

import { App } from '@/App';

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;
const organization = import.meta.env.VITE_AUTH0_ORGANIZATION as
  | string
  | undefined;
const scope = import.meta.env.VITE_AUTH0_SCOPE as string | undefined; // e.g. 'openid profile email'

if (import.meta.env.DEV) {
  // Simple diagnostics to help detect misconfiguration during development
  if (!domain) console.warn('[Auth0] VITE_AUTH0_DOMAIN no definido');
  if (!clientId) console.warn('[Auth0] VITE_AUTH0_CLIENT_ID no definido');
  if (audience) console.info('[Auth0] Audience habilitado:', audience);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ModalProvider>
        {domain && clientId ? (
          <Auth0Provider
            domain={domain}
            clientId={clientId}
            cacheLocation="localstorage"
            useRefreshTokens
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: audience || undefined,
              organization: organization || undefined,
              scope: scope || 'openid profile email',
            }}
          >
            <AuthProvider>
              <PlayersProvider>
                <NetworkActivityProvider>
                  <GameProvider>
                    <AudioProvider>
                      <App />
                    </AudioProvider>
                  </GameProvider>
                </NetworkActivityProvider>
              </PlayersProvider>
            </AuthProvider>
          </Auth0Provider>
        ) : (
          // Fallback without Auth0: provide only non-auth providers
          <PlayersProvider>
            <NetworkActivityProvider>
              <GameProvider>
                <AudioProvider>
                  <App />
                </AudioProvider>
              </GameProvider>
            </NetworkActivityProvider>
          </PlayersProvider>
        )}
      </ModalProvider>
    </ToastProvider>
  </StrictMode>,
);
