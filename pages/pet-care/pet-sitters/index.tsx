import { fetchServices } from "../../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetClinicData } from "@/types/api";
import PetCareServices from "@/components/Layout/Pet Care/CareServices";

export const getStaticProps = (async () => {
  const servicesData = await fetchServices({});
  return { props: { servicesData } };
}) satisfies GetStaticProps<{
  servicesData: PetClinicData;
}>;

export default function PetClinicPage({
  servicesData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PetCareServices servicesData={servicesData} />
    </>
  );
}
