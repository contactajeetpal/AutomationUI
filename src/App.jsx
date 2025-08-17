import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AddRemove from './pages/AddRemove.jsx'
import Validation from './pages/Validation.jsx'
import Alerts from './pages/Alerts.jsx'
import IframePage from './pages/Iframe.jsx'

export default function App(){
  return (
    <>
      <header className="header" role="banner">
        <div className="header-inner container">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">AP</div>
            <div>
              <h1>Automation Practice Playground</h1>
              <p>Realistic UI lab for interviews & daily practice</p>
            </div>
          </div>
          <span className="badge">v2.0</span>
        </div>
      </header>

      <nav className="container nav" aria-label="Main">
        <NavLink to="/" end className={({isActive})=> isActive?'active':''} data-testid="nav-home">Home</NavLink>
        <NavLink to="/add-remove" className={({isActive})=> isActive?'active':''} data-testid="nav-add-remove">Add/Remove Elements</NavLink>
        <NavLink to="/validation" className={({isActive})=> isActive?'active':''} data-testid="nav-validation">Validation</NavLink>
        <NavLink to="/alerts" className={({isActive})=> isActive?'active':''} data-testid="nav-alerts">Alerts</NavLink>
        <NavLink to="/iframe" className={({isActive})=> isActive?'active':''} data-testid="nav-iframe">iFrame</NavLink>
      </nav>

      <main className="container" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-remove" element={<AddRemove />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/iframe" element={<IframePage />} />
        </Routes>
      </main>

      <footer className="footer">Built for interview practice · Accessible, realistic, and extensible components.</footer>
    </>
  )
}
