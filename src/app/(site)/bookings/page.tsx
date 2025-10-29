/**
 * Página: Lista de Reservas
 */

import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Reservas | AvenSuites",
  description: "Gestão de reservas",
};

export default function BookingsPage() {
  return (
    <>
      <Breadcrumb pageName="Reservas" />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-dark dark:text-white">Reservas</h2>
              <a
                href="/bookings/new"
                className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90"
              >
                + Nova Reserva
              </a>
            </div>

            <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2">
              <p className="text-body-color dark:text-dark-6">
                Lista de reservas será implementada aqui
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

