import { fetchCafeRooms } from "../../api/api";

import type { GetServerSideProps } from "next";
import { RoomsData } from "@/types/api";
import CafeRooms from "@/components/Layout/Pet Cafe/CafeRooms";

export const getServerSideProps: GetServerSideProps<{
  cafeRoomData: RoomsData;
}> = async (context) => {
  try {
    const cafeRoomData = await fetchCafeRooms();
    return { props: { cafeRoomData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function CafeRoomPage({
  cafeRoomData,
}: {
  cafeRoomData: RoomsData;
}) {
  return (
    <>
      <CafeRooms cafeRoomData={cafeRoomData} />
    </>
  );
}
