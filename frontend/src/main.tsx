import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // <-- Tirei o .js daqui

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)