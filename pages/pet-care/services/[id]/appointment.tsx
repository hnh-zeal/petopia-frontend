"use client";

import { CareService } from "@/types/api";
import { fetchServiceByID } from "@/pages/api/api";
import { GetServerSideProps } from "next";
import GroomingAppointment from "@/components/Layout/Pet Care/Grooming";
import SittingAppointment from "@/components/Layout/Pet Care/Sitting";
import TrainingAppointment from "@/components/Layout/Pet Care/Training";

export const getServerSideProps: GetServerSideProps<{
  service: CareService;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const service = await fetchServiceByID(Number(id));
    return { props: { service } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetCareServiceBooking({
  service,
}: {
  service: CareService;
}) {
  return (
    <>
      {(() => {
        switch (service.type) {
          case "SITTING":
            return <SittingAppointment service={service} />;
          case "GROOMING":
            return <GroomingAppointment service={service} />;
          case "TRAINING":
            return <TrainingAppointment service={service} />;
          default:
            return null;
        }
      })()}
    </>
  );
}
