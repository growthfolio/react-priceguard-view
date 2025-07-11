import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const [tab, setTab] = useState("info"); // Aba ativa

  if (!isOpen) {
    return null;
  }

  const handleLogout = () => {
    logout();
    onClose(); // Fecha o modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Container do Modal */}
      <div className="bg-white w-full max-w-2xl max-h-[90vh] p-6 rounded-lg shadow-lg relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <img
            src={user?.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto border-4 border-teal-500 shadow-lg"
          />
          <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setTab("info")}
            className={`px-4 py-2 mx-2 rounded-t-lg ${
              tab === "info" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            Informações Básicas
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-4 py-2 mx-2 rounded-t-lg ${
              tab === "settings" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            Configurações
          </button>
          <button
            onClick={() => setTab("logout")}
            className={`px-4 py-2 mx-2 rounded-t-lg ${
              tab === "logout" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            Sair
          </button>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="overflow-y-auto max-h-[70vh]">
          {tab === "info" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>
              <p>
                <strong>Nome:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
          )}

          {tab === "settings" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Configurações</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Nome</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Bio</label>
                  <textarea
                    defaultValue="Desenvolvedor apaixonado por tecnologia e inovação."
                    className="w-full border rounded px-3 py-2"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}

          {tab === "logout" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Sair</h2>
              <p>Tem certeza de que deseja sair?</p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
