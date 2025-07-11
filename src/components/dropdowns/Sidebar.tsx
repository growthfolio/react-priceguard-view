import React from "react";

interface SidebarProps {
  isOpen: boolean; // Controle de visibilidade
  closeSidebar: () => void; // Função para fechar o Sidebar
  title: string; // Título do Sidebar
  children: React.ReactNode; // Conteúdo dinâmico
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, title, children }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-72 bg-gray-800 text-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">{title}</h2>
        <button onClick={closeSidebar} className="text-white">
          ✕
        </button>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
};

export default Sidebar;
