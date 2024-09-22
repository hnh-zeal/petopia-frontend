import { Breadcrumbs } from "@/components/breadcrumbs";
import EditCafeRoomForm from "@/components/Forms/edit-cafe-room-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { fetchCafeRoomByID, fetchCafeRooms } from "@/pages/api/api";

import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { RoomsData } from "@/types/api";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Cafe Rooms", link: "/admin/pet-cafe/cafe-rooms" },
  { title: "Edit", link: "/admin/pet-cafe/cafe-rooms/edit" },
];

export const getStaticProps = (async (context) => {
  const cafeRoom = await fetchCafeRoomByID(Number(context.params?.id));
  return { props: { cafeRoom } };
}) satisfies GetStaticProps<{
  cafeRoom: RoomsData;
}>;

export const getStaticPaths = (async () => {
  const cafeRooms = await fetchCafeRooms();

  const paths = cafeRooms.rooms.map((room: any) => ({
    params: { id: room.id.toString() }, // Convert id to string if necessary
  }));

  return {
    paths,
    fallback: false, // Set to false if you want to return 404 for any paths not returned by getStaticPaths
  };
}) satisfies GetStaticPaths;

export default function EditCafeRoom({
  cafeRoom,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
