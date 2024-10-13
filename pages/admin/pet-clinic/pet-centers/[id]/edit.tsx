import React from "react";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchPetClinicByID } from "@/pages/api/api";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Clinic } from "@/types/api";
import type { GetServerSideProps } from "next";
import EditPetClinicForm from "@/components/Forms/edit-pet-clinic-form";

const breadcrumbItems = (petClinic: Clinic) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Centers", link: "/admin/pet-clinic/pet-centers" },
  {
    title: `${petClinic.name}`,
    link: `/admin/pet-clinic/pet-centers/${petClinic.id}`,
  },
  { title: `Edit`, link: "" },
];

export const getServerSideProps: GetServerSideProps<{
  petClinic: Clinic;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const petClinic = await fetchPetClinicByID(Number(id));
    return { props: { petClinic } };
  } catch (error) {
    console.error("Error fetching petClinic:", error);
    return {
      notFound: true,
    };
  }
};

export default function EditPetClinicFormPage({
  petClinic,
}: {
  petClinic: Clinic;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(petClinic)} />
            <EditPetClinicForm petClinic={petClinic} />
          </div>
        </main>
      </div>
    </>
  );
}
