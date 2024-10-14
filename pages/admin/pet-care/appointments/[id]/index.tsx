import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchCareAppointmentByID } from "@/pages/api/api";
import React from "react";
import type { GetServerSideProps } from "next";
import CareAppointmentInfo from "@/components/Layout/Profile/CareAppointmentInfo";
import { CareAppointment } from "@/types/api";

const breadcrumbItems = (appointment: CareAppointment) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Care", link: "/admin/pet-care/services" },
  { title: "Appointments", link: "/admin/pet-care/appointments" },
  { title: `Appointment #${appointment.id}`, link: "" },
];

export const getServerSideProps: GetServerSideProps<{
  appointment: CareAppointment;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const appointment = await fetchCareAppointmentByID(Number(id));
    return { props: { appointment } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

export default function AppointmentDetails({
  appointment,
}: {
  appointment: CareAppointment;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(appointment)} />
            <CareAppointmentInfo appointment={appointment} />
          </div>
        </main>
      </div>
    </>
  );
}
