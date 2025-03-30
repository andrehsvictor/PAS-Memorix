import { useForm } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
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

  const onSubmit = (data: LoginFormInputs) => {
    // Adicione sua lógica de login aqui
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form
          className="bg-white p-6 rounded border border-gray-300 w-[25vw]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-4xl font-bold mb-4 text-center text-primary">
            Memorix
          </h1>
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
              <div className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </div>
            )}
          </div>
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
              <div className="text-red-500 text-sm mt-1">
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
            <a href="#" className="text-primary hover:text-primary-hover hover:underline transition duration-300">
              Criar conta
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
