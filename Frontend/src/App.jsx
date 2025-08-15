import React,{useState,useEffect} from 'react'
import AppRoutes from './Routes/AppRoutes'
import { AuthService } from './Features/Auth/AuthService'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUserData } from './Features/Auth/AuthSlice'


const App = () => {
    
   const dispatch = useDispatch();
   const loading = useSelector((state) => state.auth.loading);

   const data = async () => {
     try {
       const userData = await AuthService.getCurrentUser();
       console.log(userData);
       dispatch(setUserData(userData.data.data));       
     } catch (error) {
       console.log(error?.data?.message || "User is not fetched");
     }
   };

   useEffect(() => {
     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

     if (isLoggedIn) {
       
       data();
     } else {
       console.log("User is not logged in");
     }
   }, []);

  //  if(loading){
  //   return <h1>loading...</h1>
  //  }
   

  return (
    <div>
      <AppRoutes/>
    </div>
  )
}

export default App

