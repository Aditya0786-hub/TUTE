import React from 'react'
import { useState,useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login'
import Home from '../Pages/Home'

import { AuthService } from '../Features/Auth/AuthService.js'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUserData } from '../Features/Auth/AuthSlice.js'


const AppRoutes = () => {
    

  return (
    <div>
      <Routes>
        
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default AppRoutes
