import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchDoctorByID, fetchPetClinics } from "@/pages/api/api";
import React from "react";
import type { GetServerSideProps } from "next";
import EditDoctorForm from "@/components/Forms/edit-doctor-form";
import { Doctor, PetClinicData } from "@/types/api";

const breadcrumbItems = (doctor: any) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: `${doctor.name}`, link: "/admin/doctors/create" },
];

export const getServerSideProps: GetServerSideProps<{
  doctor: Doctor;
  petClinics: PetClinicData;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const doctor = await fetchDoctorByID(Number(id));
    const petClinics = await fetchPetClinics({});
    return { props: { doctor, petClinics } };
  } catch (error) {
    console.error("Error fetching cafe room:", error);
    return {
      notFound: true,
    };
  }
};

export default function DoctorDetails({
  doctor,
  petClinics,
}: {
  doctor: Doctor;
  petClinics: PetClinicData;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(doctor)} />
            <EditDoctorForm doctor={doctor} petClinics={petClinics} />
          </div>
        </main>
      </div>
    </>
  );
}
