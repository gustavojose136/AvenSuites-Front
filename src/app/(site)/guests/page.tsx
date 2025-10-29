/**
 * Página: Lista de Hóspedes
 */

import { Metadata } from "next";
import { GuestList } from "@/presentation/components/Guest/GuestList";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Hóspedes | AvenSuites",
  description: "Gestão de hóspedes",
};

export default function GuestsPage() {
  return (
    <>
      <Breadcrumb pageName="Hóspedes" />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <GuestList />
        </div>
      </section>
    </>
  );
}
