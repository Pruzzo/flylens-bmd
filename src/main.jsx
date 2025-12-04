import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Admin from './Admin.jsx'
import Operators from './Operators.jsx'
import Files from './Files.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/operators" element={<Operators />} />
        <Route path="/files" element={<Files />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
