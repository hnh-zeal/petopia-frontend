import PetClinics from "@/components/Layout/Pet Clinic/PetClinics";
import { fetchPetClinics } from "../api/api";

import type { GetServerSideProps } from "next";
import { PetClinicData } from "@/types/api";

export const getServerSideProps: GetServerSideProps<{
  clinicData: PetClinicData;
}> = async (context) => {
  try {
    const clinicData = await fetchPetClinics();
    return { props: { clinicData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetClinicPage({
  clinicData,
}: {
  clinicData: PetClinicData;
}) {
  return (
    <>
      <PetClinics clinicData={clinicData} />
    </>
  );
}
