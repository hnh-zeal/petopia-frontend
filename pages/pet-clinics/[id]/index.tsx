import type { GetServerSideProps } from "next";
import { fetchPetClinicByID } from "@/pages/api/api";
import ClinicDetails from "@/components/Layout/Pet Clinic/ClinicDetails";
import { Clinic } from "@/types/api";
import { Breadcrumbs } from "@/components/breadcrumbs";

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

const breadcrumbItems = (clinic: Clinic) => [
  { title: "Pet Clinics", link: "/pet-clinics" },
  { title: `${clinic.name}`, link: `/pet-clinics/${clinic.id}` },
];

export default function PetClinicPage({ clinic }: { clinic: Clinic }) {
  return (
    <>
      <div className="container mx-auto mt-4 p-4">
        <Breadcrumbs items={breadcrumbItems(clinic)} />
      </div>
      <ClinicDetails clinic={clinic} />
    </>
  );
}
