import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Blog from './pages/Blog'
import Layout from './pages/Layout'
import Pricing from './pages/Pricing'
import Demo from './pages/Demo'

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/demo" element={<Demo/>}/>
      </Route>
    </Routes>
  )
}

export default App
