export default function DecksPage() {
  return (
    <>
      <div className="flex items-center justify-between bg-primary p-3 w-full fixed top-0 z-10">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-3xl tracking-tight">Memorix</span>
        </div>
        {/* Adicionei space-x-8 para criar espaço entre os elementos */}
        <div className="flex-grow lg:flex lg:items-center lg:w-auto lg:justify-end">
          <div className="text-sm lg:flex-grow lg:flex lg:justify-end space-x-8">
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200"
            >
              Decks
            </a>
            <a
              href="#"
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200"
            >
              Cards
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
