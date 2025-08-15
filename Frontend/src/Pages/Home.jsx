import React,{useEffect} from 'react';
import Navbar from '../Components/Home/Navbar';
import { Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Mainlayout from '../Layout/Mainlayout';
import VideoGrid from '../Components/Video/Videogrid';
import { VideoService } from '../Features/Video/video.service';
import { setloading, setVideoData } from '../Features/Video/video.slice';

function App() {

   //get data
   const user = useSelector((state)=>state.auth.userData)
   


  // Handle search functionality
  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement your search logic here
  };

  // Handle logo click
  const handleLogoClick = () => {
    console.log('Logo clicked');
    // Navigate to home or perform action
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    console.log('Avatar clicked');
    // Open user menu or profile
  };

  
  

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Mainlayout>
        <VideoGrid/>
      </Mainlayout>

      {/* Main Content */}
    </div>
  );
}

export default App;
