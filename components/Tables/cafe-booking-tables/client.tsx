"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { adminColumns, roomColumns, userColumns } from "./columns";
import { useEffect, useState } from "react";
import { fetchRoomBooking } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState, userAuthState } from "@/states/auth";
import { CafeRoom } from "@/types/api";
import Loading from "@/pages/loading";

export const CafeBookingClient = ({
  isAdmin = false,
  cafeRoom,
}: {
  isAdmin: boolean;
  cafeRoom?: CafeRoom;
}) => {
  const router = useRouter();
  const userAuth = useRecoilValue(userAuthState);
  const adminAuth = useRecoilValue(adminAuthState);
  const [bookingData, setBookingData] = useState({
    data: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getRoomBooking = async () => {
      setLoading(true);
      try {
        const userId = userAuth?.user?.id || null; // Extract userId only once
        const data = await fetchRoomBooking({
          page: currentPage,
          pageSize: bookingData.pageSize,
          userId,
        });

        setBookingData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch clinic appointments", error);
      } finally {
        setLoading(false);
      }
    };

    getRoomBooking();
  }, [userAuth, adminAuth, currentPage, bookingData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <div className="flex flex-col space-y-3">
      {isAdmin && !cafeRoom && (
        <>
          <div className="flex items-start justify-between">
            <Heading title="Cafe Room Booking" />
          </div>
          <Separator />
        </>
      )}
      {!loading && (
        <DataTable
          searchKey="room"
          columns={
            cafeRoom ? roomColumns : isAdmin ? adminColumns : userColumns
          }
          data={bookingData.data}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={bookingData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && (
        <div className="flex items-center justify-center h-[calc(100vh-220px)]">
          <Loading />
        </div>
      )}
    </div>
  );
};
