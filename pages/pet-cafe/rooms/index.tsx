import { fetchCafeRooms } from "../../api/api";

import type { GetServerSideProps } from "next";
import { CafeRoom } from "@/types/api";
import CafeRooms from "@/components/Layout/Pet Cafe/CafeRooms";

export const getServerSideProps: GetServerSideProps<{
  cafeRooms: CafeRoom[];
}> = async (context) => {
  try {
    const cafeRoomData = await fetchCafeRooms({});
    return { props: { cafeRooms: cafeRoomData.data } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function CafeRoomPage({ cafeRooms }: { cafeRooms: CafeRoom[] }) {
  return (
    <>
      <CafeRooms cafeRooms={cafeRooms} />
    </>
  );
}
