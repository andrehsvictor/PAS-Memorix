import { useForm } from "react-hook-form";
import { GoXCircle } from "react-icons/go";
import { useAuth } from "../../contexts/auth-context";
import clsx from "clsx";
import Logo from "../../assets/logo-blue.png";

interface SignupPageProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<SignupPageProps>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { signup } = useAuth();

  const onSubmit = async (data: SignupPageProps) => {
    const { name, email, password } = data;
    const { success, error } = await signup(name, email, password);
    if (!success) {
      alert(error);
      return;
    }
    alert("Conta criada com sucesso!");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Formulário de Cadastro */}
        <form
          className="bg-white p-6 rounded-md border border-gray-300 w-[25vw]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Título */}
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="w-12 h-12" />
            <h1 className="text-4xl font-bold text-center text-primary">
              Memorix
            </h1>
          </div>
          {/* Campos do Formulário */}
          {/* Nome */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: {
                  value: 3,
                  message: "Nome deve ser maior que 3 caracteres",
                },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary p-2"
              type="text"
            />
            {touchedFields.name && errors.name && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <GoXCircle className="mr-1" />
                {errors.name.message}
              </div>
            )}
          </div>
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
          {/* Confirmar Senha */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Confirmação de senha é obrigatória",
                validate: (value) =>
                  value === watch("password") || "As senhas não coincidem",
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary p-2"
            />
            {touchedFields.confirmPassword && errors.confirmPassword && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <GoXCircle className="mr-1" />
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          {/* Botão de Cadastro */}
          <button
            type="submit"
            // className={`w-full text-white py-2 rounded transition duration-300 ${
            //   isValid
            //     ? "bg-primary hover:bg-primary-hover cursor-pointer"
            //     : "bg-primary-disabled cursor-not-allowed"
            // }
            // `}
            className={clsx(
              "w-full text-white py-2 rounded transition duration-300",
              isValid
                ? "bg-primary hover:bg-primary-hover cursor-pointer"
                : "bg-primary-disabled cursor-not-allowed"
            )}
            disabled={!isValid}
          >
            Criar Conta
          </button>
        </form>
      </div>
    </>
  );
}
