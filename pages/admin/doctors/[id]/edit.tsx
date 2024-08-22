import { Breadcrumbs } from "@/components/breadcrumbs";
import EditDoctorForm from "@/components/Forms/edit-doctor-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/router";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: "Edit", link: "/admin/doctors/edit" },
];
export default function EditDoctor() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="calc(80vh-220px)">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <EditDoctorForm id={Number(id)} />
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
