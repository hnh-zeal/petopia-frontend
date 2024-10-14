import { Breadcrumbs } from "@/components/breadcrumbs";
import CafePetsCards from "@/components/Layout/cafe-pet-cards";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { fetchCafePets } from "@/pages/api/api";
import { CafePetData } from "@/types/api";
import { GetServerSideProps } from "next";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pets", link: "/admin/cafe-pets" },
];

export const getServerSideProps: GetServerSideProps<{
  petsData: CafePetData;
}> = async (context) => {
  try {
    const petsData = await fetchCafePets({ page: 1, pageSize: 6 });
    return { props: { petsData: petsData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function CafePets({ petsData }: { petsData: CafePetData }) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <CafePetsCards petsData={petsData} />
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
