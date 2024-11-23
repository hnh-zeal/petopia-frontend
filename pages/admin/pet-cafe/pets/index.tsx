import { Breadcrumbs } from "@/components/breadcrumbs";
import CafePetsCards from "@/components/Layout/cafe-pet-cards";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pets", link: "/admin/cafe-pets" },
];

export default function CafePets() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <CafePetsCards />
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
