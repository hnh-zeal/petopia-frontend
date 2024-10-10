import type { GetServerSideProps } from "next";
import { fetchServiceByID } from "@/pages/api/api";
import { CareService } from "@/types/api";
import ServiceDetails from "@/components/Layout/Pet Care/CareServiceDetails";

export const getServerSideProps: GetServerSideProps<{
  service: CareService;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const service = await fetchServiceByID(Number(id));
    return { props: { service } };
  } catch (error) {
    console.error("Error fetching care service:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetClinicPage({ service }: { service: CareService }) {
  return (
    <>
      <ServiceDetails service={service} />
    </>
  );
}
