import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './common/reset.css'
import { App } from '@/pages'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
