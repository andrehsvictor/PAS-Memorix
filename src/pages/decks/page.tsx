import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsArrowClockwise, BsExclamationCircle } from "react-icons/bs";
import { GoPlus, GoXCircle } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/empty-state";
import Navbar from "../../components/navbar";
import { useReviewContext } from "../../contexts/review-context";
import useCreateDeck from "../../hooks/useCreateDeck";
import useDeleteDeck from "../../hooks/useDeleteDeck";
import useFetchDecks from "../../hooks/useFetchDecks";
import DeckComponent from "./components/deck";
import Dialog from "./components/dialog";
import ReviewNotification from "./components/review-notification";
import SearchBar from "./components/searchbar";

interface CreateDeckFormProps {
  name: string;
  description?: string;
}

export default function Page() {
  const { decks, isLoading, error, refetch, sortedDecks } = useFetchDecks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<
    "recent" | "alphabetical" | "byCardCount"
  >("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
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
  const { cards } = useReviewContext();
  const navigate = useNavigate();

  const getSortedDecks = () => {
    return sortedDecks[sortOption];
  };

  const filteredDecks = getSortedDecks().filter(
    (deck) =>
      !searchQuery ||
      deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateDeck = (data: CreateDeckFormProps) => {
    create(data);
    setIsDialogOpen(false);
    reset();

    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este baralho?")) {
      deleteDeck(deckId);
      refetch();
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen pb-10">
        <Navbar />
        <main className="container mx-auto px-4 pt-8">
          {/* Mensagem de boas-vindas */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 flex flex-col items-start"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-opacity-10 p-2 rounded-full">
                <BsExclamationCircle className="text-2xl text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Bem-vindo de volta!
              </h1>
            </div>
            <p className="text-gray-600">
              Aqui estão seus baralhos e cartões para revisar.
            </p>
          </motion.div>

          {/* Área de utilitários */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Pesquisar baralhos..."
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              {error && (
                <button
                  onClick={refetch}
                  className="flex items-center gap-1 text-primary hover:text-primary-hover"
                  title="Tentar novamente"
                >
                  <BsArrowClockwise className="text-lg" />
                  Recarregar
                </button>
              )}

              <button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors duration-300"
              >
                <GoPlus className="text-xl" />
                Novo Baralho
              </button>
            </div>
          </div>

          {/* Notificação da quantidade de cartões para revisar */}
          {cards.length > 0 && (
            <div className="mb-6">
              <ReviewNotification cardCount={cards.length} className="mb-4" />
            </div>
          )}

          {/* Seção dos baralhos */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            {/* Mostrar mensagem de erro se houver */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
                <BsExclamationCircle className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            {/* Cabeçalho da seção */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {!isLoading &&
                  filteredDecks.length > 0 &&
                  `${filteredDecks.length} ${
                    filteredDecks.length === 1 ? "baralho" : "baralhos"
                  }`}
                {isLoading && "Carregando baralhos..."}
              </h2>

              <div className="flex gap-2">
                <select
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(
                      e.target.value as
                        | "recent"
                        | "alphabetical"
                        | "byCardCount"
                    );
                  }}
                  disabled={isLoading}
                >
                  <option value="recent">Mais recentes</option>
                  <option value="alphabetical">Nome</option>
                  <option value="byCardCount">Nº cartões</option>
                </select>
              </div>
            </div>

            {/* Estado de carregamento */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredDecks.length === 0 ? (
              <EmptyState
                icon={
                  <BsExclamationCircle className="text-4xl text-gray-400" />
                }
                title={
                  searchQuery
                    ? "Nenhum baralho encontrado"
                    : "Você ainda não tem baralhos"
                }
                description={
                  searchQuery
                    ? `Não encontramos baralhos correspondentes a "${searchQuery}".`
                    : "Crie seu primeiro baralho para começar a estudar."
                }
                action={
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    <GoPlus />
                    Criar meu primeiro baralho
                  </button>
                }
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDecks.map((deck) => (
                    <motion.div
                      key={deck.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <DeckComponent
                        deck={deck}
                        onDelete={handleDeleteDeck}
                        onView={(deckId) => {
                          navigate(`/decks/${deckId}`);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.section>

          <Dialog onClose={() => setIsDialogOpen(false)} isOpen={isDialogOpen}>
            <div className="flex items-center mb-4">
              <GoPlus className="text-3xl text-primary" />
              <h2 className="text-xl font-semibold text-gray-800 ml-2">
                Criar novo baralho
              </h2>
            </div>
            <form onSubmit={handleSubmit(handleCreateDeck)}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nome do baralho
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ex: Matemática Básica"
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
                    "border rounded-lg p-2.5 w-full bg-gray-50",
                    {
                      "border-red-500 ring-1 ring-red-500":
                        errors.name && touchedFields.name,
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
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Descrição{" "}
                  <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Descreva o conteúdo deste baralho..."
                  {...register("description")}
                  className="border border-gray-300 rounded-lg p-2.5 w-full h-28 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={clsx("px-4 py-2 rounded-lg text-white", {
                    "bg-primary hover:bg-primary-hover cursor-pointer": isValid,
                    "bg-gray-400 cursor-not-allowed": !isValid,
                  })}
                >
                  Criar baralho
                </button>
              </div>
            </form>
          </Dialog>
        </main>
      </div>
    </>
  );
}
