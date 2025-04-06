import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { PiPencil } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import FloatingButton from "../../components/floating-button";
import Navbar from "../../components/navbar";
import useCreateCard from "../../hooks/useCreateCard";
import useDeleteCard from "../../hooks/useDeleteCard";
import useDeleteDeck from "../../hooks/useDeleteDeck";
import useEditCard from "../../hooks/useEditCard";
import useFetchCardsByDeckId from "../../hooks/useFetchCardsByDeckId";
import useFetchDeckById from "../../hooks/useFetchDeckById";
import Card from "../../types/card";
import Deck from "../../types/deck";
import CardsTable from "./components/cards-table";
import CreateCardDialog from "./components/create-card-dialog";
import EditCardDialog from "./components/edit-card-dialog";
import EditDeckDialog from "./components/edit-deck-dialog";
import useEditDeck from "../../hooks/useEditDeck";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, fetchDeckById } = useFetchDeckById();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const { fetchCardsByDeckId } = useFetchCardsByDeckId();
  const { editCard } = useEditCard();
  const { deleteCard } = useDeleteCard();
  const { createCard } = useCreateCard();
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false);
  const [isEditDeckDialogOpen, setIsEditDeckDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { deleteDeck } = useDeleteDeck();
  const { editDeck } = useEditDeck();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (deck) {
      const cards = fetchCardsByDeckId(deck.id);
      setCards(cards);
    }
  }, [deck]);

  return (
    <>
      <FloatingButton onClick={() => setIsCreateCardDialogOpen(true)}>
        <GoPlus className="text-2xl" />
        Adicionar cartão
      </FloatingButton>

      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        {/* Botão icone de voltar. */}
        <button
          className="absolute top-20 left-4 bg-primary rounded-full p-2 text-white cursor-pointer hover:bg-primary-hover transition duration-300 shadow-md"
          aria-label="Voltar"
        >
          <a href="/">
            <BsArrowLeft className="text-2xl" />
          </a>
        </button>

        <div className="flex flex-col items-center justify-center h-screen">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {deck && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[80%] h-[80%] overflow-auto">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold mb-4">{deck.name}</h2>
                {/* Deve ser um botão de editar baralho e ao lado um botão de excluir baralho */}
                <div className="ml-auto">
                  <button
                    onClick={() => {
                      setIsEditDeckDialogOpen(true);
                    }}
                    className="bg-primary text-white rounded-full px-4 py-2 hover:bg-primary-hover transition duration-200 cursor-pointer"
                  >
                    <PiPencil className="inline-block mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      deleteDeck(deck.id);
                      window.location.href = "/";
                    }}
                    className="bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 transition duration-200 ml-4 cursor-pointer"
                  >
                    <BiTrash className="inline-block mr-1" />
                    Excluir
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{deck.description}</p>

              <CardsTable
                cards={cards}
                onEditCard={(card) => {
                  setSelectedCard(card);
                  setIsEditCardDialogOpen(true);
                }}
                onDeleteCard={(cardId) => {
                  deleteCard(cardId);
                  navigate(0);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <CreateCardDialog
        isOpen={isCreateCardDialogOpen}
        onClose={() => setIsCreateCardDialogOpen(false)}
        onSubmit={(data) => {
          createCard(id || "", {
            question: data.question,
            answer: data.answer,
          });
          navigate(0);
        }}
      />
      <EditCardDialog
        isOpen={isEditCardDialogOpen}
        onClose={() => setIsEditCardDialogOpen(false)}
        card={selectedCard}
        onSubmit={(data) => {
          editCard(selectedCard?.id || "", {
            question: data.question,
            answer: data.answer,
          });
          navigate(0);
        }}
      />
      <EditDeckDialog
        isOpen={isEditDeckDialogOpen}
        onClose={() => setIsEditDeckDialogOpen(false)}
        deck={deck}
        onSubmit={(data) => {
          editDeck(deck?.id || "", {
            name: data.name,
            description: data.description,
          });
          navigate(0);
        }}
      />
    </>
  );
}
