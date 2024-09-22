import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import CafeRoomInfo from "@/components/Layout/Profile/CafeRoomInfo";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { fetchCafeRoomByID } from "@/pages/api/api";
import { CafeRoom } from "@/types/api";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import type { GetServerSideProps } from "next";

const breadcrumbItems = (cafeRoom: CafeRoom) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Cafe Rooms", link: "/admin/pet-cafe/cafe-rooms" },
  {
    title: `${cafeRoom.name}`,
    link: `/admin/pet-cafe/cafe-rooms/${cafeRoom.id}`,
  },
];

export const getServerSideProps: GetServerSideProps<{
  cafeRoom: CafeRoom;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const cafeRoom = await fetchCafeRoomByID(Number(id));
    return { props: { cafeRoom } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

export default function CafeRoomDetails({ cafeRoom }: { cafeRoom: CafeRoom }) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems(cafeRoom)} />
              <CafeRoomInfo cafeRoom={cafeRoom} />
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
