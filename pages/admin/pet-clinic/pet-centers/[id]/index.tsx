import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchPetClinicByID } from "@/pages/api/api";
import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import PetClinicInfo from "@/components/Layout/Profile/PetClinicInfo";
import { Clinic } from "@/types/api";
import Loading from "@/pages/loading";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = (petClinic: Clinic) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Centers", link: "/admin/pet-clinic/pet-centers" },
  { title: `${petClinic.name}`, link: "/admin/pet-clinic/pet-centers/create" },
];

export const getServerSideProps: GetServerSideProps<{
  petClinic: Clinic;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const petClinic = await fetchPetClinicByID(Number(id));
    return { props: { petClinic } };
  } catch (error) {
    console.error("Error fetching petClinic:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetClinicDetailsPage({
  petClinic,
}: {
  petClinic: Clinic;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(petClinic)} />
            <ScrollArea className="h-[calc(100vh-120px)]">
              {!loading ? (
                <PetClinicInfo petClinic={petClinic} />
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-220px)]">
                  <Loading />
                </div>
              )}
            </ScrollArea>
          </div>
        </main>
      </div>
    </>
  );
}
