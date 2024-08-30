import PetClinics from "@/components/Layout/Pet Clinic/PetClinics";
import { fetchPetClinics } from "../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetClinicData } from "@/types/api";

export const getStaticProps = (async () => {
  const clinicData = await fetchPetClinics();
  return { props: { clinicData } };
}) satisfies GetStaticProps<{
  clinicData: PetClinicData;
}>;

export default function PetClinicPage({
  clinicData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PetClinics clinicData={clinicData} />
    </>
  );
}
