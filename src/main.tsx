import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

// Errores que escapan del árbol de React (promesas rechazadas sin catch, errores de
// inicialización) no los atrapa ningún límite de errores: sin esto solo quedan en
// la consola y el usuario ve una pantalla muerta sin ningún indicio.
window.addEventListener('unhandledrejection', (event) => {
    console.error('[unhandledrejection]', event.reason)
})

window.addEventListener('error', (event) => {
    console.error('[window.error]', event.message)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
