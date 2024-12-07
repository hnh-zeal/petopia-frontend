import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchPetSitterByID } from "@/pages/api/api";
import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import { PetSitter } from "@/types/api";
import PetSitterInfo from "@/components/Layout/Profile/PetSitterInfo";
import Loading from "@/pages/loading";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = (petSitter: PetSitter) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Sitters", link: "/admin/pet-sitters" },
  { title: `${petSitter.name}`, link: "/admin/pet-sitters/create" },
];

export const getServerSideProps: GetServerSideProps<{
  petSitter: PetSitter;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const petSitter = await fetchPetSitterByID(Number(id));
    return { props: { petSitter } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function DoctorDetails({ petSitter }: { petSitter: PetSitter }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(petSitter)} />
            <ScrollArea className="h-[calc(100vh-120px)]">
              {!loading ? (
                <PetSitterInfo petSitter={petSitter} />
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
