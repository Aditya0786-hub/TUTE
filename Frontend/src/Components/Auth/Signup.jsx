import React from "react";
import { useState } from "react";
import bgImage from '../../assets/pink-arrow-sign-with-copy-space.jpg'
import {
  Mail,
  Lock,
  Eye,
  User,
  Globe,
  User2,
  UploadCloud,
  UserCircle,
  Loader2,
  EyeOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUserData } from "../../Features/Auth/AuthSlice";
import { AuthService } from "../../Features/Auth/AuthService";

const Signup = ({ setLogin }) => {


  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [message, setMessage] = useState(null);
  const [showpass,setShowPass] = useState(false)

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("avatar", formData.avatar);
    //Api calling to send data to backend
    try {
      dispatch(setLoading(true));
      const user = await AuthService.register(data);
      console.log(user);
      dispatch(setLoading(false));
      dispatch(setUserData(user.data.data));
      setMessage("User Registered");
    } catch (error) {
      console.log(error.data?.response?.message || "Registeration Failed");
      dispatch(setLoading(false));
      setMessage("Registration Failed");
    }

    console.log({
      ...formData,
      avatar: formData.avatar?.name,
    });
  };

  return (
    <div
      className=" flex items-center justify-center sm:p-4 bg-cover bg-center backdrop-blur-md p-0"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* overlay */}
      <div className="absolute backdrop-blur-sm inset-0 bg-black/50"></div>
      <div className="bg-white z-5  rounded-lg shadow-lg w-full max-w-md p-8">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="text-indigo-500" size={28} />
            </div>
          </div>
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Please Register your account.
          </p>
          {/* Social Buttons */}
          <button className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 mb-3 hover:bg-gray-50 transition">
            <Globe className="mr-2" size={18} />
            Continue with Google
          </button>
          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">
              or continue with email
            </span>
            <hr className="flex-grow border-gray-300" />
          </div>
          {/* fullName */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <UserCircle className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                name="fullName" //important
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.fullName}
                className="w-full py-2 focus:outline-none"
                required
              />
            </div>
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="email"
                name="email" //important
                placeholder="Enter your email"
                onChange={handleChange}
                value={formData.email}
                className="w-full py-2 focus:outline-none"
                required
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
                name="username"
                placeholder="Enter your username"
                className="w-full py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.username}
                required
              />
            </div>
          </div>
          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <Lock className="text-gray-400 mr-2" size={18} />
              <input
                type={showpass ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full py-2 focus:outline-none"
                onChange={handleChange}
                value={formData.password}
                required
              />
              {showpass ? (
                <Eye
                  onClick={() => setShowPass(false)}
                  className="text-gray-400 cursor-pointer"
                  size={18}
                />
              ) : (
                <EyeOff
                  onClick={() => setShowPass(true)}
                  className="text-gray-400 cursor-pointer"
                  size={18}
                />
              )}
            </div>
          </div>
          {/* Drop zone file for avatar */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Upload Avatar Image
            </label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50 transition"
            >
              <UploadCloud className="text-gray-400 mb-2" size={24} />
              <span className="text-gray-500 text-sm">
                Click to upload or drag and drop
              </span>
              <input
                id="file-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFileChange(e);
                  handleChange(e);
                }}
              />
            </label>
            {file && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Selected File:</p>
                <p className="text-gray-900 font-medium">{file.name}</p>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 rounded-md hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Signing in...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="flex justify-center items-center">
          <p className="text-black font-medium p-4">{message}</p>
        </div>

        {/* Sign In Button */}

        <div className="flex justify-center  pt-4">
          <p className="text-gray-600">
            Already have a account?
            <span
              className="text-blue-700 font-medium cursor-pointer"
              onClick={() => setLogin(true)}
            >
              Sign-In Here!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
