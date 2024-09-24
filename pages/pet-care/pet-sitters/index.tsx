import { fetchServices } from "../../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetClinicData } from "@/types/api";
import PetSitters from "@/components/Layout/Pet Care/PetSitters";

export const getStaticProps = (async () => {
  const petSittersData = await fetchServices({});
  return { props: { petSittersData } };
}) satisfies GetStaticProps<{
  petSittersData: PetClinicData;
}>;

export default function PetSittersPage({
  petSittersData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PetSitters doctorsData={petSittersData} />
    </>
  );
}
