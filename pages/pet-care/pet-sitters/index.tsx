import { fetchPetSitters } from "../../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetSitter } from "@/types/api";
import PetSitters from "@/components/Layout/Pet Care/PetSitters";

export const getStaticProps = (async () => {
  const petSittersData = await fetchPetSitters({});
  return { props: { petSitters: petSittersData.petSitters } };
}) satisfies GetStaticProps<{
  petSitters: PetSitter[];
}>;

export default function PetSittersPage({
  petSitters,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PetSitters petSitters={petSitters} />
    </>
  );
}
