import { fetchCafePets } from "../../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetClinicData } from "@/types/api";
import Pets from "@/components/Layout/Pet Cafe/Pets";

export const getStaticProps = (async () => {
  const petsData = await fetchCafePets();
  return { props: { petsData } };
}) satisfies GetStaticProps<{
  petsData: PetClinicData;
}>;

export default function CafePetsPage({
  petsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Pets petsData={petsData} />
    </>
  );
}
