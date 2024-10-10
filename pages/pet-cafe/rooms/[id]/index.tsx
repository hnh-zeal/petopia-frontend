import type { GetServerSideProps } from "next";
import { fetchCafeRoomByID } from "@/pages/api/api";
import { CafeRoom } from "@/types/api";
import CafeRoomDetails from "@/components/Layout/Pet Cafe/CafeRoomDetails";

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

export default function RoomDetailPage({ cafeRoom }: { cafeRoom: CafeRoom }) {
  return (
    <>
      <CafeRoomDetails cafeRoom={cafeRoom} />
    </>
  );
}
