import { Breadcrumbs } from "@/components/breadcrumbs";
import CreatePetSitterForm from "@/components/Forms/create-sitter-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Sitters", link: "/admin/pet-sitters" },
  { title: "Create", link: "/admin/pet-sitters/create" },
];

export default function CreatePetSitter() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <CreatePetSitterForm />
          </div>
        </main>
      </div>
    </>
  );
}
