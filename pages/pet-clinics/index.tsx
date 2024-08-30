import PetClinics from "@/components/Layout/Pet Clinic/PetClinic";
import { fetchPetClinics } from "../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";

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
