import clsx from "clsx";
import { useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import FloatingButton from "../../components/floating-button";
import type Deck from "../../types/deck";
import DeckComponent from "./components/deck";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";

export default function Page() {
  // const { decks } = useFetchDecks();
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setDecks((prev) => [
        ...prev,
        {
          id: `deck-${i}`,
          name: `Baralho ${i}`,
          description: `Descrição do baralho ${i}`,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  }, []);

  return (
    <>
      {/* Background */}
      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <main className="flex flex-col items-center justify-center min-h-scree mt-5 w-full">
          {/* Barra de pesquisa */}
          <SearchBar onSearch={(query) => console.log(query)} />

          {/* Botão flutuante de adicionar baralho */}
          <FloatingButton onClick={() => console.log("Adicionar baralho")}>
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
            {decks.map((deck) => (
              <DeckComponent
                key={deck.id}
                deck={deck}
                onDelete={(deckId) => console.log("Deletar baralho", deckId)}
                onEdit={(deck) => console.log("Editar baralho", deck)}
              />
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
