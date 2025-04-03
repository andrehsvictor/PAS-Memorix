import clsx from "clsx";
import { ReactNode } from "react";

interface DialogProps {
  onClose: () => void;
  isOpen: boolean;
  children: ReactNode;
}

export default function Dialog({ onClose, isOpen, children }: DialogProps) {
  return (
    <>
      {/* <div className="fixed inset-0 bg-black opacity-80 z-40"></div> */}
      <div
        className={clsx(
          "fixed inset-0 bg-black opacity-80 z-40",
          isOpen ? "block" : "hidden"
        )}
      ></div>

      {/* Caixa de diálogo */}
      {/* <div className="fixed inset-0 flex items-center justify-center z-50"> */}
      <div
        className={clsx(
          "fixed inset-0 flex items-center justify-center z-50",
          isOpen ? "block" : "hidden"
        )}
      >
        {/* Conteúdo do diálogo */}
        <div className="bg-white rounded-lg p-6 w-[60%] shadow-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200 cursor-pointer"
            >
              &times;
            </button>
          </div>
          <>{children}</>
        </div>
      </div>
    </>
  );
}
