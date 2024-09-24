import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateCafePetsForm from "@/components/Forms/create-cafe-pets-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pets", link: "/admin/pet-cafe/pets" },
  { title: "Create", link: "/admin/pet-cafe/pets/create" },
];

export default function CreatePetSitter() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <CreateCafePetsForm />
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
