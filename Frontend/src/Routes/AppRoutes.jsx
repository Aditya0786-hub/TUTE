import React from 'react'
import { useState,useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login'
import Home from '../Pages/Home'
import { AuthService } from '../Features/Auth/AuthService.js'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUserData } from '../Features/Auth/AuthSlice.js'
import Playback from '../Components/Video/Playback.jsx'
import VideoDetail from '../Pages/VideoDetail.jsx'
import ProfilePage from '../Components/Profile.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Upload from '../Components/Video/Upload.jsx'



const AppRoutes = () => {
   
 
  return (
    <div>
      <Routes>
        
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/video/:videoId' element={<VideoDetail/>}/>
        <Route path='/profile/:username' element={<ProfilePage/>}/>
        <Route path='/mycontent' element={<Upload/>}/>        
      </Routes>
    </div>
  )
}

export default AppRoutes
