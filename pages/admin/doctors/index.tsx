import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { DoctorClient } from "@/components/Tables/doctor-tables/client";
import { Toaster } from "@/components/ui/toaster";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
];

export default function Doctors() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <DoctorClient />
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
