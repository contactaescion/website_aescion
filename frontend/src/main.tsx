import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

// HelmetProvider type fix for React 19
// const HelmetProviderAny = HelmetProvider as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <HelmetProviderAny> */}
    <App />
    {/* </HelmetProviderAny> */}
  </StrictMode>,
)
