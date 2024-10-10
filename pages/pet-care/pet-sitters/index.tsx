import { fetchPetSitters } from "../../api/api";

import type { GetServerSideProps } from "next";
import { PetSitter } from "@/types/api";
import PetSitters from "@/components/Layout/Pet Care/PetSitters";

export const getServerSideProps: GetServerSideProps<{
  petSitters: PetSitter[];
}> = async (context) => {
  try {
    const petSittersData = await fetchPetSitters({});
    return { props: { petSitters: petSittersData.petSitters } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetSittersPage({
  petSitters,
}: {
  petSitters: PetSitter[];
}) {
  return (
    <>
      <PetSitters petSitters={petSitters} />
    </>
  );
}
