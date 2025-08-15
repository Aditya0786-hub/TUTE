import { useState } from "react";
import { Clock, Folder, Heart, Home, Menu, User, Video } from "lucide-react";

const menuItems = [
  { icons: User,label: "My profile"},
  { icons: Home,label: "Home"},
  { icons: Heart,label: "Liked Videos"},
  { icons: Clock,label: "Watch History"},
  { icons: Video,label: "My Content"},
  { icons: Folder,label: "Subscribers"},
  ]

export default function Sidebar({setIsOpen,isOpen}) {
  

  return (
    <>
      {/* Mobile Menu Toggle */}
      

      {/* Sidebar */}
      <aside
        className={`fixed  left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 z-50`}
      >
        

        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item,index) => (
            <button
              key={item.label}
              className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm font-medium"
            >
              <item.icons/>
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
