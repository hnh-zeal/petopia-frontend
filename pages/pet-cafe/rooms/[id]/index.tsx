import type { GetServerSideProps } from "next";
import { fetchCafeRoomByID } from "@/pages/api/api";
import { CafeRoom } from "@/types/api";
import CafeRoomDetails from "@/components/Layout/Pet Cafe/CafeRoomDetails";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const getServerSideProps: GetServerSideProps<{
  cafeRoom: CafeRoom;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const cafeRoom = await fetchCafeRoomByID(Number(id));
    return { props: { cafeRoom } };
  } catch (error) {
    console.error("Error fetching cafe room:", error);
    return {
      notFound: true,
    };
  }
};

const breadcrumbItems = (cafeRoom: CafeRoom) => [
  { title: "Pet Cafe Rooms", link: "/pet-cafe/rooms" },
  { title: `${cafeRoom.name}`, link: `/pet-cafe/rooms/${cafeRoom.id}` },
];

export default function RoomDetailPage({ cafeRoom }: { cafeRoom: CafeRoom }) {
  return (
    <>
      <div className="container mx-auto mt-4 p-4">
        <Breadcrumbs items={breadcrumbItems(cafeRoom)} />
      </div>
      <CafeRoomDetails cafeRoom={cafeRoom} />
    </>
  );
}
