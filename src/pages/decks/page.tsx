import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsArrowClockwise, BsExclamationCircle } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/empty-state";
import Navbar from "../../components/navbar";
import { useReviewContext } from "../../contexts/review-context";
import useCreateDeck from "../../hooks/useCreateDeck";
import useDeleteDeck from "../../hooks/useDeleteDeck";
import useFetchDecks from "../../hooks/useFetchDecks";
import DeckComponent from "./components/deck";
import DeckForm from "./components/deck-form";
import Dialog from "./components/dialog";
import ReviewNotification from "./components/review-notification";
import SearchBar from "./components/searchbar";
import { useAuth } from "../../contexts/auth-context";

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

  const { reset } = useForm<CreateDeckFormProps>({
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
  const { isAuthenticated } = useAuth();

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

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
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
            <DeckForm
              onSubmit={(data) => {
                handleCreateDeck(data);
                reset();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </main>
      </div>
    </>
  );
}
