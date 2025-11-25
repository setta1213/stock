import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // เหลือแค่ BrowserRouter
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ลบ Routes และ Route ที่ครอบ App ออกให้หมดครับ */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)