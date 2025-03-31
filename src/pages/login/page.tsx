import { useForm } from "react-hook-form";
import { GoXCircle } from "react-icons/go";
import { useAuth } from "../../contexts/auth-context";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormInputs) => {
    const { success, error } = await login(data.email, data.password);
    if (!success) {
      alert(error);
      return;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Formulário de Login */}
        <form
          className="bg-white p-6 rounded-md border border-gray-300 w-[25vw]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Título */}
          <h1 className="text-4xl font-bold mb-4 text-center text-primary">
            Memorix
          </h1>
          {/* Campos do Formulário */}
          {/* E-mail */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              {...register("email", {
                required: "E-mail é obrigatório",
                minLength: {
                  value: 3,
                  message: "E-mail deve ser maior que 3 caracteres",
                },
                validate: (value) =>
                  value.includes("@") || "E-mail deve conter um '@'",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary p-2"
              type="email"
            />
            {touchedFields.email && errors.email && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <GoXCircle className="mr-1" />
                {errors.email.message}
              </div>
            )}
          </div>
          {/* Senha */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "Senha deve ser maior que 6 caracteres",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary p-2"
            />
            {touchedFields.password && errors.password && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <GoXCircle className="mr-1" />
                {errors.password.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`w-full text-white py-2 rounded transition duration-300 ${
              isValid
                ? "bg-primary hover:bg-primary-hover cursor-pointer"
                : "bg-primary-disabled cursor-not-allowed"
            }
            `}
            disabled={!isValid}
          >
            Entrar
          </button>
          <div className="mt-4 text-left text-sm">
            <a
              href="/signup"
              className="text-primary hover:text-primary-hover hover:underline transition duration-300"
            >
              Criar conta
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
