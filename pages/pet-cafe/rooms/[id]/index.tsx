import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

const rooms = [
  {
    id: 1,
    name: "Cozy Cat Corner",
    roomNo: "CC101",
    description: "A purr-fect space for feline lovers",
    capacity: 10,
    amenities: ["Cat trees", "Scratching posts", "Cozy beds"],
    pricePerHour: 25,
  },
  // Add more rooms with detailed information
];

import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import { fetchCafeRoomByID, fetchCafeRooms } from "@/pages/api/api";
import { RoomsData } from "@/types/api";
import CafeRoomDetails from "@/components/Layout/Pet Cafe/CafeRoomDetails";

export const getStaticProps = (async (context) => {
  const cafeRoom = await fetchCafeRoomByID(Number(context.params?.id));
  return { props: { cafeRoom } };
}) satisfies GetStaticProps<{
  cafeRoom: RoomsData;
}>;

export const getStaticPaths = (async () => {
  const roomsData = await fetchCafeRooms();

  const paths = roomsData.rooms.map((room: any) => ({
    params: { id: room.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}) satisfies GetStaticPaths;

export default function RoomDetailPage({
  cafeRoom,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <CafeRoomDetails cafeRoom={cafeRoom} />
    </>
  );
}
