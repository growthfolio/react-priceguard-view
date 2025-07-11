const UserInfo = ({ user }: { user: { name: string; email: string; avatar: string } }) => (
    <div className="flex flex-col items-center bg-gray-800 text-white p-6 text-center">
      <img
        src={user.avatar}
        alt="Avatar"
        className="w-32 h-32 rounded-full border-4 border-teal-400 shadow-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
      <p className="text-gray-400">{user.email}</p>
      <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
        Editar Perfil
      </button>
    </div>
  );
  
  export default UserInfo;
  