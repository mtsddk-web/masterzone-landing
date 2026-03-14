"use client";

import { useEmailGate } from "@/hooks/useEmailGate";
import EmailGateModal from "./EmailGateModal";

export default function BlogCTA() {
  const { isEmailGateOpen, openEmailGate, closeEmailGate, handleEmailSuccess } = useEmailGate();

  return (
    <>
      <EmailGateModal
        isOpen={isEmailGateOpen}
        onClose={closeEmailGate}
        onSuccess={handleEmailSuccess}
      />
      <section className="mt-12 bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Chcesz pracowac w skupieniu kazdego dnia?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Dolacz do MasterZone i pracuj w blokach glebokiej pracy razem z innymi.
          Codziennie, o stalych godzinach, z kamera i zobowiazaniem.
        </p>
        <button
          onClick={() => openEmailGate("blog_cta_button")}
          className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300 cursor-pointer"
        >
          Dolacz do MasterZone — 7 dni za darmo
        </button>
      </section>
    </>
  );
}
