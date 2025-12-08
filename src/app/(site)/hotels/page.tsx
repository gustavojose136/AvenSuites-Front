

import { Metadata } from "next";
import { HotelList } from "@/presentation/components/Hotel/HotelList";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Hotéis | AvenSuites",
  description: "Gestão de hotéis",
};

export default function HotelsPage() {
  return (
    <>
      <Breadcrumb pageName="Hotéis" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          <HotelList />
        </div>
      </section>
    </>
  );
}

