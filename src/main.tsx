import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/pt-sans/400.css'
import '@fontsource/pt-sans/700.css'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
