import { GoCopy, GoVersions } from "react-icons/go";
import { RxAvatar } from "react-icons/rx";
import Logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between bg-primary p-3 w-full z-10">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <img src={Logo} alt="Logo" className="h-9 w-9 rounded-full" />
        <span className="font-semibold text-3xl tracking-tight">Memorix</span>
      </div>
      <div className="flex items-center gap-10">
        <div className="flex lg:flex lg:items-center lg:w-auto lg:justify-end">
          <div className="text-sm lg:flex-grow lg:flex lg:justify-end gap-4">
            <a
              href="/decks"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 font-semibold"
            >
              <GoVersions className="inline-block mr-1" strokeWidth={1.5} />
              Baralhos
            </a>
            <a
              href="/cards"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 font-semibold"
            >
              <GoCopy className="inline-block mr-1" strokeWidth={1.5} />
              Cartões
            </a>
          </div>
        </div>
        <a
          href="#"
          className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 font-semibold"
        >
          <RxAvatar className="inline-block mr-1 text-3xl" strokeWidth={0.05} />
        </a>
      </div>
    </div>
  );
}
