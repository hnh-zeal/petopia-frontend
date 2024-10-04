import { Breadcrumbs } from "@/components/breadcrumbs";
import CreatePetClinicForm from "@/components/Forms/create-clinic-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Centers", link: "/admin/pet-clinic/pet-centers" },
  { title: "Create", link: "/admin/pet-clinic/pet-centers/create" },
];

export default function CreateUser() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <CreatePetClinicForm />
          </div>
        </main>
      </div>
    </>
  );
}
