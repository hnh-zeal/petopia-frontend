import { fetchCafePets } from "../../api/api";

import type { GetServerSideProps } from "next";
import { PetClinicData } from "@/types/api";
import Pets from "@/components/Layout/Pet Cafe/Pets";

export const getServerSideProps: GetServerSideProps<{
  petsData: PetClinicData;
}> = async (context) => {
  try {
    const petsData = await fetchCafePets();
    return { props: { petsData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function CafePetsPage({
  petsData,
}: {
  petsData: PetClinicData;
}) {
  return (
    <>
      <Pets petsData={petsData} />
    </>
  );
}
