import React from "react";
import { Link } from "react-router-dom";

interface DropdownMenuProps {
  items: { label: string; to: string }[]; // Lista de itens no menu
  toggleDropdown: () => void; // Função para alternar o dropdown
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, toggleDropdown }) => {
  return (
    <div className="absolute right-1 mt-5 w-48 bg-gray-800 text-white rounded-b-lg shadow-lg z-20">
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <li key={index} className="border-b border-gray-700 last:border-none">
            <Link
              to={item.to}
              onClick={toggleDropdown}
              className="block px-4 py-2 hover:bg-gray-700 rounded"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
