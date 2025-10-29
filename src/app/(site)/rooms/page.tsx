/**
 * Página: Lista de Quartos
 */

import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Quartos | AvenSuites",
  description: "Gestão de quartos",
};

export default function RoomsPage() {
  return (
    <>
      <Breadcrumb pageName="Quartos" />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">
              Gestão de Quartos
            </h2>
            <p className="text-body-color dark:text-dark-6">
              Selecione um hotel para visualizar seus quartos
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

