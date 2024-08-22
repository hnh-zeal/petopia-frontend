import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { DoctorClient } from "@/components/Tables/doctor-tables/client";
import { CareServicesClient } from "@/components/Tables/pet-care-tables/client";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Care Services", link: "/admin/pet-care/services" },
];

export default function PetCareServices() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <CareServicesClient />
            </div>
            <div>
              <Toaster />
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
