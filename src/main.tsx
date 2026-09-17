import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = <StrictMode><App /></StrictMode>
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
document.documentElement.dataset.enhanced = 'true'
const updateVisibility = () => {
  document.documentElement.toggleAttribute('data-page-hidden', document.hidden)
}
document.addEventListener('visibilitychange', updateVisibility)
updateVisibility()
