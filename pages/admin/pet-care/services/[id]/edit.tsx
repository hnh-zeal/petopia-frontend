import { Breadcrumbs } from "@/components/breadcrumbs";
import EditCafeRoomForm from "@/components/Forms/edit-cafe-room-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { fetchServiceByID } from "@/pages/api/api";
import type { GetServerSideProps } from "next";
import { CareService } from "@/types/api";
import EditServiceForm from "@/components/Forms/edit-services-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Care Services", link: "/admin/pet-care/services" },
  { title: "Edit", link: "/admin/pet-care/services/edit" },
];

export const getServerSideProps: GetServerSideProps<{
  service: CareService;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const service = await fetchServiceByID(Number(id));
    return { props: { service: service } };
  } catch (error) {
    console.error("Error fetching service:", error);
    return {
      notFound: true,
    };
  }
};

export default function EditCafeRoom({ service }: { service: CareService }) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <EditServiceForm service={service} />
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
