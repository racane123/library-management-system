import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { clearServiceWorker, preventChromeExtensionCaching } from './utils/clearServiceWorker.js'

// Clear any cached service workers on app start
clearServiceWorker();

// Prevent chrome-extension caching
preventChromeExtensionCaching();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 