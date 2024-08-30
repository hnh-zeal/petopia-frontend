import PetClinics from "@/components/Layout/Pet Clinic/PetClinics";
import { fetchDoctors } from "../../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetClinicData } from "@/types/api";
import Doctors from "@/components/Layout/Pet Clinic/Doctors";

export const getStaticProps = (async () => {
  const doctorsData = await fetchDoctors();
  return { props: { doctorsData } };
}) satisfies GetStaticProps<{
  doctorsData: PetClinicData;
}>;

export default function PetClinicPage({
  doctorsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Doctors doctorsData={doctorsData} />
    </>
  );
}
