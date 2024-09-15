import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ClinicAppointmentClient } from "@/components/Tables/clinic-appointment-tables/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Clinic", link: "/admin/pet-clinic/pet-centers" },
  {
    title: "Appointments",
    link: "/admin/pet-clinic/appointments",
  },
];

export default function ClinicAppointments() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <ClinicAppointmentClient isAdmin={true} />
          </div>
        </main>
      </div>
    </>
  );
}
