import type { GetServerSideProps } from "next";
import { fetchPetClinicByID } from "@/pages/api/api";
import ClinicDetails from "@/components/Layout/Pet Clinic/ClinicDetails";
import { Clinic } from "@/types/api";

export const getServerSideProps: GetServerSideProps<{
  clinic: Clinic;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const clinic = await fetchPetClinicByID(Number(id));
    return { props: { clinic } };
  } catch (error) {
    console.error("Error fetching pet clinic:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetClinicPage({ clinic }: { clinic: Clinic }) {
  return (
    <>
      <ClinicDetails clinic={clinic} />
    </>
  );
}
