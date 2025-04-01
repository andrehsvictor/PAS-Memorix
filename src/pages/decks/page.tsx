import { GoCopy, GoPlus, GoSearch, GoVersions } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import Navbar from "./components/navbar";
import clsx from "clsx";
import SearchBar from "./components/searchbar";
import FloatingButton from "../../components/floating-button";

export default function Page() {
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
            <div className="bg-white shadow-md rounded-lg border border-gray-300 p-4">
              <h2 className="text-lg font-semibold mb-2">Baralho 1</h2>
              <p className="text-gray-600">Descrição do baralho 1.</p>
              <div className="flex justify-between mt-4">
                <button className="bg-primary text-white py-1 px-3 rounded-md">
                  Editar
                </button>
                <button className="bg-red-500 text-white py-1 px-3 rounded-md">
                  Deletar
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
