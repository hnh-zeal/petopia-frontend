import { Breadcrumbs } from "@/components/breadcrumbs";
import CafeRoom from "@/components/Layout/cafe-pet-rooms";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { fetchCafeRooms } from "@/pages/api/api";
import { RoomsData } from "@/types/api";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import type { InferGetStaticPropsType, GetStaticProps } from "next";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Cafe Room", link: "/admin/cafe-rooms" },
];

export const getStaticProps = (async (context) => {
  const roomData = await fetchCafeRooms(1, 6);
  return { props: { roomData } };
}) satisfies GetStaticProps<{
  roomData: RoomsData;
}>;

export default function CafeRooms({
  roomData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <CafeRoom roomData={roomData} />
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
