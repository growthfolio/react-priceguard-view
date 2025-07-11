import { User, Gear, List } from "@phosphor-icons/react";

const Tabs = ({ activeTab, onChange }: { activeTab: string; onChange: (tab: string) => void }) => (
  <div className="flex justify-center mt-6">
    <button
      onClick={() => onChange("info")}
      className={`flex items-center px-6 py-2 mx-2 rounded-t-lg ${
        activeTab === "info" ? "bg-teal-500 text-white" : "bg-gray-200"
      }`}
    >
      <User className="mr-2" size={20} /> Informações Básicas
    </button>
    <button
      onClick={() => onChange("settings")}
      className={`flex items-center px-6 py-2 mx-2 rounded-t-lg ${
        activeTab === "settings" ? "bg-teal-500 text-white" : "bg-gray-200"
      }`}
    >
      <Gear className="mr-2" size={20} /> Configurações
    </button>
    <button
      onClick={() => onChange("activity")}
      className={`flex items-center px-6 py-2 mx-2 rounded-t-lg ${
        activeTab === "activity" ? "bg-teal-500 text-white" : "bg-gray-200"
      }`}
    >
      <List className="mr-2" size={20} /> Atividades Recentes
    </button>
  </div>
);

export default Tabs;
