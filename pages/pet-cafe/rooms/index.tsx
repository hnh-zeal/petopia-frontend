import { fetchCafeRooms } from "../../api/api";

import type { InferGetStaticPropsType, GetStaticProps } from "next";
import { PetClinicData } from "@/types/api";
import CafeRooms from "@/components/Layout/Pet Cafe/CafeRooms";

export const getStaticProps = (async () => {
  const cafeRoomData = await fetchCafeRooms();
  return { props: { cafeRoomData } };
}) satisfies GetStaticProps<{
  cafeRoomData: PetClinicData;
}>;

export default function CafeRoomPage({
  cafeRoomData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <CafeRooms cafeRoomData={cafeRoomData} />
    </>
  );
}
