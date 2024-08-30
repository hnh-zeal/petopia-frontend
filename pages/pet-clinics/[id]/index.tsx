import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { fetchPetClinicByID, fetchPetClinics } from "@/pages/api/api";
import ClinicDetails from "@/components/Layout/Pet Clinic/ClinicDetails";
import { PetClinicData } from "@/types/api";

export const getStaticProps = (async (context) => {
  const clinic = await fetchPetClinicByID(Number(context.params?.id));
  return { props: { clinic } };
}) satisfies GetStaticProps<{
  clinic: PetClinicData;
}>;

export const getStaticPaths = (async () => {
  const clinicData = await fetchPetClinics();

  const paths = clinicData.clinics.map((doctor: any) => ({
    params: { id: doctor.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export default function PetClinicPage({
  clinic,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <ClinicDetails clinic={clinic} />
    </>
  );
}
