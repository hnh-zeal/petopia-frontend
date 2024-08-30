import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import {
  fetchDoctorByID,
  fetchDoctors,
  fetchPetClinics,
} from "@/pages/api/api";
import React from "react";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import EditDoctorForm from "@/components/Forms/edit-doctor-form";
import { Doctor, PetClinicData } from "@/types/api";

const breadcrumbItems = (doctor: any) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: `${doctor.name}`, link: "/admin/doctors/create" },
];

export const getStaticProps = (async (context) => {
  const doctor = await fetchDoctorByID(Number(context.params?.id));
  const petClinics = await fetchPetClinics();
  return { props: { doctor, petClinics } };
}) satisfies GetStaticProps<{
  doctor: Doctor;
  petClinics: PetClinicData;
}>;

export const getStaticPaths = (async () => {
  const doctorData = await fetchDoctors();

  const paths = doctorData.doctors.map((doctor: any) => ({
    params: { id: doctor.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export default function DoctorDetails({
  doctor,
  petClinics,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
