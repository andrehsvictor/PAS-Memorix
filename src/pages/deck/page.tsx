import { useParams } from "react-router-dom";
import useFetchDeckById from "../../hooks/useFetchDeckById";
import { useEffect, useState } from "react";
import Deck from "../../types/deck";
import Navbar from "../../components/navbar";
import Card from "../../types/card";
import useFetchCardsByDeckId from "../../hooks/useFetchCardsByDeckId";
import FloatingButton from "../../components/floating-button";
import { GoPlus, GoXCircle } from "react-icons/go";
import { PiPencil } from "react-icons/pi";
import { BiTrash } from "react-icons/bi";
import { useForm } from "react-hook-form";
import Dialog from "../decks/components/dialog";
import clsx from "clsx";

interface CreateCardFormProps {
  question: string;
  answer: string;
}

interface EditCardFormProps {
  question: string;
  answer: string;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, fetchDeckById } = useFetchDeckById();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([
    {
      id: "",
      question: "Qual é a capital da França?",
      answer: "Paris",
      deckId: id || "",
      easinessFactor: 0,
      interval: 0,
      repetitions: 0,
      nextReviewAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const { fetchCardsByDeckId } = useFetchCardsByDeckId();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<CreateCardFormProps>({
    mode: "onChange",
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: {
      errors: errorsEdit,
      isValid: isValidEdit,
      touchedFields: touchedFieldsEdit,
    },
  } = useForm<EditCardFormProps>({
    mode: "onChange",
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false);

  useEffect(() => {
    if (!id || id === "" || id === "undefined") {
      setDeck(null);
      return;
    }
    const deck = fetchDeckById(id);
    if (error) {
      console.error(error);
    }
    setDeck(deck);
  }, [id]);

  //   useEffect(() => {
  //     if (deck) {
  //       const cards = fetchCardsByDeckId(deck.id);
  //       setCards(cards);
  //     }
  //   }, [deck]);

  return (
    <>
      <FloatingButton onClick={() => console.log("Adicionar cartão")}>
        <GoPlus className="text-2xl" />
        Adicionar cartão
      </FloatingButton>

      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {deck && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[80%] h-[80%] overflow-auto">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold mb-4">{deck.name}</h2>
                <div className="ml-auto">
                  <p className="text-gray-500 text-sm">
                    Criado em:{" "}
                    {new Date(deck.createdAt).toLocaleDateString() +
                      " " +
                      new Date(deck.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Atualizado em:{" "}
                    {new Date(deck.updatedAt).toLocaleDateString() +
                      " " +
                      new Date(deck.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cartões
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cards.map((card) => (
                    <tr key={card.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {card.question} - {card.answer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            // Handle edit card
                          }}
                          className="text-primary hover:text-primary-hover"
                        >
                          <PiPencil className="inline-block mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            // Handle delete card
                          }}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <BiTrash className="inline-block mr-1" />
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateCardDialog
        isOpen={isCreateCardDialogOpen}
        onClose={() => setIsCreateCardDialogOpen(false)}
        onSubmit={(data) => {
          console.log(data);
          // Handle create card
        }}
      />
    </>
  );
}

interface CreateCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCardFormProps) => void;
}

function CreateCardDialog({
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
