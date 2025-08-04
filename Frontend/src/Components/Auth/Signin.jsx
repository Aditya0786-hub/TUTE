import React from 'react'
import { useState } from "react";
import { Mail, Lock, Eye, User, Globe, User2, UploadCloud } from "lucide-react";

const Signin = ({setLogin}) => {

      const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
      });

        const handleChange = (e) => {
         const { name, value, files } = e.target;
         setFormData((prev) => ({
           ...prev,
           [name]: files ? files[0] : value,
         }));
       };

       const handleSubmit = async(e)=>{
        e.preventDefault()
        
        
       }
        
      

    return (
    <div className="min-h-screen flex items-center justify-center sm:p-4 bg-gradient-to-r from-indigo-500 to-purple-500 p-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {/* Avatar Icon */}
    <form >
            <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="text-indigo-500" size={28} />
          </div>
        </div>
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">
          Please sign in to your account
        </p>

        {/* Social Buttons */}
        <button className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 mb-3 hover:bg-gray-50 transition">
          <Globe className="mr-2" size={18} />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or continue with email</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              name='email'
              onClick={handleChange}
              placeholder="Enter your email"
              className="w-full py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* User Id */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">User Name</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <User2 className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              name='username'
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              name='password'
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full py-2 focus:outline-none"
            />
            <Eye className="text-gray-400 cursor-pointer" size={18} />
          </div>
        </div>
        {/* Sign In Button */}
        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 rounded-md hover:opacity-90 transition">
          Sign In
        </button>
     </form>
       
        <div className="flex justify-center mt-6">
          <p className="text-gray-600">Already have a account?<span className="text-blue-700 font-medium cursor-pointer" onClick={()=>setLogin(false)}>Sign-In Here!</span></p>
        </div>
      </div>
    </div>
  );
}

export default Signin
