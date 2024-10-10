import { fetchServices } from "../../api/api";

import type { GetServerSideProps } from "next";
import { CareServicesData } from "@/types/api";
import PetCareServices from "@/components/Layout/Pet Care/CareServices";

export const getServerSideProps: GetServerSideProps<{
  servicesData: CareServicesData;
}> = async (context) => {
  try {
    const servicesData = await fetchServices();
    return { props: { servicesData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetClinicPage({
  servicesData,
}: {
  servicesData: CareServicesData;
}) {
  return (
    <>
      <PetCareServices servicesData={servicesData} />
    </>
  );
}
