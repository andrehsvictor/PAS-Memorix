import clsx from "clsx";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import FloatingButton from "../../components/floating-button";
import type Deck from "../../types/deck";
import DeckComponent from "./components/deck";
import Navbar from "./components/navbar";
import SearchBar from "./components/searchbar";
import { BsExclamationCircle } from "react-icons/bs";

export default function Page() {
  const [decks, setDecks] = useState<Deck[]>([
    // {
    //   id: "1",
    //   name: "Baralho 1",
    //   description: "Descrição do baralho 1",
    //   userId: "user1",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
    // {
    //   id: "2",
    //   name: "Baralho 2",
    //   description: "Descrição do baralho 2",
    //   userId: "user1",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
    // {
    //   id: "3",
    //   name: "Baralho 3",
    //   description: "Descrição do baralho 3",
    //   userId: "user1",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
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
              {
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4":
                  decks.length > 0,
              },
              // Se houver baralhos, exibe os cards em uma grade
              // Caso contrário, exibe uma mensagem centralizada
              "flex flex-col items-center justify-center",
              "bg-white rounded-lg p-10",
              "w-[80%] mt-5"
            )}
          >
            {/* Card de baralho */}
            {decks.length === 0 && (
              // Se não houver baralhos, exibe uma mensagem com um ícone de exclamação

              // <div className="flex flex-col items-center justify-center w-full h-full">
              //   <BsExclamationCircle className="text-6xl text-gray-400 mb-4" />
              //   <h2 className="text-2xl font-bold text-gray-700">
              //     Nenhum baralho encontrado
              //   </h2>
              //   <p className="text-gray-500">
              //     Crie um novo baralho para começar a estudar.
              //   </p>
              // </div>
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
