import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsExclamationCircle } from "react-icons/bs";
import { GoPlus, GoXCircle } from "react-icons/go";
import FloatingButton from "../../components/floating-button";
import useCreateDeck from "../../hooks/useCreateDeck";
import useFetchDecks from "../../hooks/useFetchDecks";
import DeckComponent from "./components/deck";
import Dialog from "./components/dialog";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";
import useDeleteDeck from "../../hooks/useDeleteDeck";

interface CreateDeckFormProps {
  name: string;
  description?: string;
}

export default function Page() {
  const { decks } = useFetchDecks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<CreateDeckFormProps>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { create } = useCreateDeck();
  const { deleteDeck } = useDeleteDeck();
  const [filteredDecks, setFilteredDecks] = useState(decks);

  const handleSearch = (query: string) => {
    if (query.length === 0 || query.trim() === "") {
      setFilteredDecks(decks);
      return;
    }
    const filtered = decks.filter((deck) =>
      deck.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDecks(filtered);
  };

  useEffect(() => {
    setFilteredDecks(decks);
  }, [decks]);

  return (
    <>
      {/* Background */}
      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <main className="flex flex-col items-center justify-center min-h-scree mt-5 w-full">
          {/* Barra de pesquisa */}
          <SearchBar onSearch={handleSearch} />

          {/* Botão flutuante de adicionar baralho */}
          <FloatingButton onClick={() => setIsDialogOpen(true)}>
            <GoPlus className="text-2xl" />
            Adicionar baralho
          </FloatingButton>

          {/* Notificação da quantidade de cartões para revisar */}
          <div
            className={clsx(
              "flex items-center justify-between",
              "bg-white rounded-lg p-4",
              "border border-primary",
              "w-[80%]"
            )}
          >
            <div className="flex items-center">
              <BsExclamationCircle className="text-2xl text-primary mr-2" />
              <span className="text-gray-700">
                Você tem 5 cartões para revisar
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => console.log("Revisar cartões")}
                className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-hover transition duration-200"
              >
                Revisar cartões
              </button>
            </div>
          </div>

          {/* Seção dos baralhos */}
          <section
            className={clsx(
              {
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4":
                  decks.length > 0,
              },
              "flex flex-col items-center justify-center",
              "bg-white rounded-lg p-10",
              "overflow-y-scroll",
              "h-[50vh]",
              "w-[80%] mt-5"
            )}
          >
            {/* Card de baralho */}
            {decks.length === 0 && (
              <div className="flex flex-col items-center justify-center w-full h-full p-10">
                <BsExclamationCircle className="text-6xl text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 text-center">
                  Nenhum baralho encontrado
                </h2>
              </div>
            )}
            {filteredDecks.map((deck) => (
              <DeckComponent
                key={deck.id}
                deck={deck}
                onDelete={(deckId) => {
                  deleteDeck(deckId);
                  window.location.reload();
                }}
                onView={(deckId) => {
                  window.location.href = `/decks/${deckId}`;
                }}
              />
            ))}
          </section>

          <Dialog onClose={() => setIsDialogOpen(false)} isOpen={isDialogOpen}>
            <h2 className="text-2xl font-bold mb-4">Criar baralho</h2>
            <form
              onSubmit={handleSubmit((data) => {
                create(data);
                setIsDialogOpen(false);
                window.location.reload();
              })}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Nome do baralho
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Nome deve ter pelo menos 3 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "Nome deve ter no máximo 50 caracteres",
                    },
                  })}
                  className={clsx(
                    "border rounded-lg p-2 w-full",
                    {
                      "border-red-500": errors.name && touchedFields.name,
                      "border-gray-300": !errors.name,
                    },
                    "focus:outline-none focus:ring-2 focus:ring-primary"
                  )}
                />
                {errors.name && touchedFields.name && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <GoXCircle className="mr-1" />
                    {errors.name.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="border border-gray-300 rounded-lg p-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={!isValid}
                className={clsx("bg-primary text-white rounded-lg px-4 py-2", {
                  "opacity-50 cursor-not-allowed": !isValid,
                  "hover:bg-primary-hover": isValid,
                })}
              >
                Criar baralho
              </button>
            </form>
          </Dialog>
        </main>
      </div>
    </>
  );
}
