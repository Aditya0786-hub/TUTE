import React,{useState} from 'react'
import Navbar from '../Components/Home/Navbar'
import { Zap } from 'lucide-react';
import { useSelector } from 'react-redux';
import Sidebar from '../Components/Home/Sidebar,';
import Sidebar2 from '../Components/Home/Sidebar2';

const Mainlayout = ({children}) => {

     //get data
   const user = useSelector((state)=>state.auth.userData)
   const [isOpen, setIsOpen] = useState(false);
   


  // Handle search functionality
  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement your search logic here
  };

  // Handle logo click
  const handleLogoClick = () => {
    setIsOpen(prev=>!prev)
    // Navigate to home or perform action
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    console.log('Avatar clicked');
    // Open user menu or profile
  };


  return (
    <div>
      {/* <Navbar
        companyName="TechFlow"
        logoIcon={Zap}
        searchPlaceholder="Search products, users, or content..."
        userAvatarSrc={user?user.avatar:"https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"}
        userName={user?.fullName}
        onSearch={handleSearch}
        onLogoClick={handleLogoClick}
        onAvatarClick={handleAvatarClick}
        setIsOpen={setIsOpen}
      /> */}
      <div>
        {/* <Sidebar  isOpen={isOpen}/> */}
        <Sidebar2/>
        {children}
      </div>
      
    </div>
  )
}

export default Mainlayout
