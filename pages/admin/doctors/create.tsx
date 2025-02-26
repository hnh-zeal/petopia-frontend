import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateDoctorForm from "@/components/Forms/create-doctor-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: "Create", link: "/admin/doctors" },
];

export default function CreateDoctor() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <CreateDoctorForm />
          </div>
        </main>
      </div>
    </>
  );
}
