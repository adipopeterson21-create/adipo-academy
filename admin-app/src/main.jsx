import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login/>} />
        <Route path="/admin/*" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App/>)