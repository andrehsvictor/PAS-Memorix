import clsx from "clsx";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import FloatingButton from "../../components/floating-button";
import type Deck from "../../types/deck";
import DeckComponent from "./components/deck";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";

export default function Page() {
  const [decks, setDecks] = useState<Deck[]>([
    {
      id: "1",
      name: "Baralho 1",
      description: "Descrição do baralho 1",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Baralho 2",
      description: "Descrição do baralho 2",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Baralho 3",
      description: "Descrição do baralho 3",
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
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

          {/* Seção dos baralhos */}
          <section
            className={clsx(
              "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
              "bg-white rounded-lg p-10",
              "w-[80%] mt-5"
            )}
          >
            {/* Card de baralho */}
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
