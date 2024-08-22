import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateDoctorForm from "@/components/Forms/create-doctor-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
// import { ProductForm } from '@/components/forms/product-form';
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: `Name`, link: "/admin/doctors/create" },
];

export default function DoctorDetails() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <DoctorDetails />
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
