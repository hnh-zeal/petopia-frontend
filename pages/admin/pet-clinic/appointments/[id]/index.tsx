import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchClinicAppointmentByID } from "@/pages/api/api";
import React from "react";
import type { GetServerSideProps } from "next";
import AppointmentInfo from "@/components/Layout/Profile/AppointmentInfo";
import { ClinicAppointment } from "@/types/api";

const breadcrumbItems = (appointment: ClinicAppointment) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/pet-clinic/appointments" },
  { title: `Appointment #${appointment.id}`, link: "" },
];

export const getServerSideProps: GetServerSideProps<{
  appointment: ClinicAppointment;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const appointment = await fetchClinicAppointmentByID(Number(id));
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
  appointment: ClinicAppointment;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(appointment)} />
            <AppointmentInfo appointment={appointment} />
          </div>
        </main>
      </div>
    </>
  );
}
