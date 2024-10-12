import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchDoctorByID } from "@/pages/api/api";
import React from "react";
import type { GetServerSideProps } from "next";
import { Doctor } from "@/types/api";
import DoctorDetails from "@/components/Layout/Pet Clinic/DoctorDetails";

const breadcrumbItems = (doctor: any) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: `${doctor.name}`, link: "/admin/doctors/create" },
];

export const getServerSideProps: GetServerSideProps<{
  doctor: Doctor;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const doctor = await fetchDoctorByID(Number(id));
    return { props: { doctor } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function DoctorPage({ doctor }: { doctor: Doctor }) {
  return (
    <>
      <DoctorDetails doctor={doctor} />
    </>
  );
}
