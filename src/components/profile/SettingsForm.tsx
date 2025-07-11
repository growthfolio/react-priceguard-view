import { useForm } from "react-hook-form";

const SettingsForm = ({ user }: { user: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Dados enviados:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-gray-700">Nome</label>
        <input
          {...register("name", { required: "O nome é obrigatório" })}
          defaultValue={user.name}
          className="w-full border rounded px-3 py-2"
        />
        {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          {...register("email", { required: "O email é obrigatório" })}
          defaultValue={user.email}
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Bio</label>
        <textarea
          {...register("bio")}
          defaultValue={user.bio}
          className="w-full border rounded px-3 py-2"
        ></textarea>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
      >
        Salvar Alterações
      </button>
    </form>
  );
};

export default SettingsForm;
