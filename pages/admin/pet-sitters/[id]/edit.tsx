import { Breadcrumbs } from "@/components/breadcrumbs";
import EditSitterForm from "@/components/Forms/edit-sitter-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchPetSitterByID } from "@/pages/api/api";
import { PetSitter } from "@/types/api";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Sitters", link: "/admin/pet-sitters" },
  { title: "Edit", link: "/admin/pet-sitters/edit" },
];

export const getServerSideProps: GetServerSideProps<{
  petSitter: PetSitter;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const petSitter = await fetchPetSitterByID(Number(id));
    return { props: { petSitter } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

export default function EditPetSitter({ petSitter }: { petSitter: PetSitter }) {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="calc(80vh-220px)">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <EditSitterForm petSitter={petSitter} />
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
