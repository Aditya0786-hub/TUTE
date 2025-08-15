import React from 'react'
import { Clock, Folder, Ham, Heart, Home, Menu, User, Video } from "lucide-react";

const menuItems = [
  { icons: User,label: "My profile"},
  { icons: Home,label: "Home"},
  { icons: Heart,label: "Liked Videos"},
  { icons: Clock,label: "Watch History"},
  { icons: Video,label: "My Content"},
  { icons: Folder,label: "Subscribers"},
  ]

const Sidebar2 = () => {
  return (
    <div className="h-full fixed top-0 left-0 w-20 z-10 bg-white">
      <div className="flex items-center  flex-col">
        {menuItems.map((item, idx) => (
          <div className="w-full h-20 flex flex-col items-center justify-center hover:bg-amber-50  hover:rounded-4xl">
            <button key={item.label}><item.icons/></button>
            <span className="text-xs hover:text-blue-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar2
