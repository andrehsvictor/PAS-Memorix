import { GoSearch } from "react-icons/go";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <>
      {/* <div className="flex items-center justify-center w-[50%] mb-4 bg-white rounded-4xl border border-gray-300">
        <GoSearch className="text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="Pesquisar baralhos..."
          className="w-full p-2 rounded-l-md focus:outline-none"
        />
      </div> */}
      <div className="flex items-center justify-center w-[50%] mb-4 bg-white rounded-4xl border border-gray-300">
        <GoSearch className="text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="Pesquisar baralhos..."
          className="w-full p-2 rounded-l-md focus:outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </>
  );
}
