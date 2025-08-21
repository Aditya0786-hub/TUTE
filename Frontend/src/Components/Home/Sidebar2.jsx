import React, { useState } from "react";
import { Clock, Folder, Heart, Home, Menu, User, Video } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar2 = () => {
  const user = useSelector((state) => state.auth.userData);
  const [sidebar, setSidebar] = useState(false);

  const menuItems = [
    { icons: User, label: "My profile", link: `/profile/${user?.username}` },
    { icons: Home, label: "Home", link: "/" },
    { icons: Heart, label: "Liked Videos", link: "/liked" },
    { icons: Clock, label: "Watch History", link: "/history" },
    { icons: Video, label: "My Content", link: "/mycontent" },
    { icons: Folder, label: "Subscribers", link: "/subscribers" },
  ];

  return (
    <div
      onClick={() => setSidebar(!sidebar)}
      className={`h-full fixed top-0 left-0 z-10 bg-white shadow-lg transition-all duration-300 ease-in-out
        ${sidebar ? "w-56" : "w-20"}`}
    >
      {/* Toggle Button */}
      {/* <div className={`flex ${sidebar?"":"justify-center"} p-3`}>
        <button onClick={() => setSidebar(!sidebar)}>
          <Menu />
        </button>
      </div> */}

      {/* Menu Items */}
      <div className="flex flex-col">
        {menuItems.map((item) => (
          <Link to={item.link} key={item.label} className="w-full">
            <div className={`w-full h-16 flex items-center ${sidebar?"":"justify-center"} gap-3 px-4 hover:bg-amber-50 transition`}>
              <item.icons className="shrink-0" />
              {/* Smoothly hide/show labels */}
              <span
                className={`text-sm whitespace-nowrap transition-all duration-300
                ${sidebar ? "opacity-100" : "opacity-0 hidden"}`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar2;
