import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { fetchServiceByID, fetchServices } from "@/pages/api/api";
import { CareServicesData } from "@/types/api";
import ServiceDetails from "@/components/Layout/Pet Care/CareServiceDetails";

export const getStaticProps = (async (context) => {
  const service = await fetchServiceByID(Number(context.params?.id));
  return { props: { service } };
}) satisfies GetStaticProps<{
  service: CareServicesData;
}>;

export const getStaticPaths = (async () => {
  const servicesData = await fetchServices({});

  const paths = servicesData.careServices.map((service: any) => ({
    params: { id: service.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export default function PetClinicPage({
  service,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <ServiceDetails service={service} />
    </>
  );
}
