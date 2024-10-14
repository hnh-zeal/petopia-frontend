import type { GetServerSideProps } from "next";
import { fetchServiceByID } from "@/pages/api/api";
import { CareService, Clinic } from "@/types/api";
import ServiceDetails from "@/components/Layout/Pet Care/CareServiceDetails";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const getServerSideProps: GetServerSideProps<{
  service: CareService;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const service = await fetchServiceByID(Number(id));
    return { props: { service } };
  } catch (error) {
    console.error("Error fetching care service:", error);
    return {
      notFound: true,
    };
  }
};

const breadcrumbItems = (service: CareService) => [
  { title: "Pet Care Services", link: "/pet-care/services" },
  { title: `${service.name}`, link: `/pet-care/services/${service.id}` },
];

export default function PetClinicPage({ service }: { service: CareService }) {
  return (
    <>
      <div className="container mx-auto mt-4 p-4">
        <Breadcrumbs items={breadcrumbItems(service)} />
      </div>
      <ServiceDetails service={service} />
    </>
  );
}
