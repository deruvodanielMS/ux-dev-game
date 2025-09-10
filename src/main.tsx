import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {domain && clientId ? (
      <Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: window.location.origin }}>
        <App />
      </Auth0Provider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
