import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// No StrictMode: avoids double-initialising Lenis / ScrollTrigger in dev.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
