import clsx from "clsx";
import { useForm } from "react-hook-form";
import { GoXCircle } from "react-icons/go";
import Dialog from "../../decks/components/dialog";

interface CreateCardFormProps {
  question: string;
  answer: string;
}

interface CreateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCardFormProps) => void;
}

export default function CreateCardDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateCardDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<CreateCardFormProps>({
    mode: "onChange",
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const handleFormSubmit = (data: CreateCardFormProps) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog onClose={onClose} isOpen={isOpen}>
      <h2 className="text-2xl font-bold mb-4">Criar cartão</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-gray-700 font-bold mb-2"
          >
            Pergunta
          </label>
          <input
            type="text"
            id="question"
            {...register("question", {
              required: "Pergunta é obrigatória",
              minLength: {
                value: 3,
                message: "Pergunta deve ter pelo menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "Pergunta deve ter no máximo 50 caracteres",
              },
            })}
            className={clsx(
              "border rounded-lg p-2 w-full",
              {
                "border-red-500": errors.question && touchedFields.question,
                "border-gray-300": !errors.question,
              },
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          />
          {errors.question && touchedFields.question && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <GoXCircle className="mr-1" />
              {errors.question.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="answer"
            className="block text-gray-700 font-bold mb-2"
          >
            Resposta
          </label>
          <input
            type="text"
            id="answer"
            {...register("answer", {
              required: "Resposta é obrigatória",
              minLength: {
                value: 3,
                message: "Resposta deve ter pelo menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "Resposta deve ter no máximo 50 caracteres",
              },
            })}
            className={clsx(
              "border rounded-lg p-2 w-full",
              {
                "border-red-500": errors.answer && touchedFields.answer,
                "border-gray-300": !errors.answer,
              },
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
          />
          {errors.answer && touchedFields.answer && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <GoXCircle className="mr-1" />
              {errors.answer.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className={clsx("bg-primary text-white rounded-lg px-4 py-2", {
            "opacity-50 cursor-not-allowed": !isValid,
            "hover:bg-primary-hover": isValid,
          })}
        >
          Criar cartão
        </button>
      </form>
    </Dialog>
  );
}
