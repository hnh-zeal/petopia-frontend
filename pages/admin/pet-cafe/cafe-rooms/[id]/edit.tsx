import { Breadcrumbs } from "@/components/breadcrumbs";
import EditCafeRoomForm from "@/components/Forms/edit-cafe-room-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { fetchCafeRoomByID } from "@/pages/api/api";

import type { GetServerSideProps } from "next";
import { CafeRoom } from "@/types/api";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Cafe Rooms", link: "/admin/pet-cafe/cafe-rooms" },
  { title: "Edit", link: "/admin/pet-cafe/cafe-rooms/edit" },
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

export default function EditCafeRoom({ cafeRoom }: { cafeRoom: CafeRoom }) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <EditCafeRoomForm cafeRoom={cafeRoom} />
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
