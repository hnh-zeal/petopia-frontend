import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchDoctorByID } from "@/pages/api/api";
import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import DoctorInfo from "@/components/Layout/Profile/DoctorInfo";
import { Doctor } from "@/types/api";
import Loading from "@/pages/loading";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = (doctor: any) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Doctors", link: "/admin/doctors" },
  { title: `${doctor.name}`, link: "/admin/doctors/create" },
];

export const getServerSideProps: GetServerSideProps<{
  doctor: Doctor;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const doctor = await fetchDoctorByID(Number(id));
    return { props: { doctor } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function DoctorDetails({ doctor }: { doctor: Doctor }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems(doctor)} />
            <ScrollArea className="h-[calc(100vh-120px)]">
              {!loading ? (
                <DoctorInfo doctor={doctor} />
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
