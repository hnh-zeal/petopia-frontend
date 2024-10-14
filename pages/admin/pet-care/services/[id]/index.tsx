import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import ServiceInfo from "@/components/Layout/Profile/ServiceInfo";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { fetchServiceByID } from "@/pages/api/api";
import { CareService } from "@/types/api";
import { GetServerSideProps } from "next";

const breadcrumbItems = (service: CareService) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Care Services", link: "/admin/pet-care/services" },
  { title: `${service.name}`, link: `/admin/pet-care/services/${service.id}` },
];

export const getServerSideProps: GetServerSideProps<{
  service: CareService;
}> = async (context) => {
  try {
    const { id } = context.params as { id: string };
    const service = await fetchServiceByID(Number(id));
    return { props: { service } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function CareServiceInfoPage({
  service,
}: {
  service: CareService;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(service)} />
            <ServiceInfo service={service} />
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
