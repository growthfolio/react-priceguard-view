import { User } from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Ícone de Perfil */}
       {/* Ícone de Perfil para Telas Grandes */}
       <button onClick={toggleMenu} className="hidden lg:flex items-center hover:text-teal-400">
        <span className="rounded-full bg-teal-500 p-2">
            <User size={20} />
        </span>
        </button>

      {/* Menu Suspenso */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Perfil
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Configurações
          </Link>
          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
