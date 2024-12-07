"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
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
  const userAuth = useRecoilValue(userAuthState);
  const adminAuth = useRecoilValue(adminAuthState);
  const [bookingData, setBookingData] = useState({
    data: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 6,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getRoomBooking = async () => {
      setLoading(true);
      try {
        const roomId = cafeRoom?.id;
        const userId = userAuth?.user?.id || null; // Extract userId only once
        const data = await fetchRoomBooking({
          page: currentPage,
          pageSize: bookingData.pageSize,
          ...(roomId && { roomId }),
          userId,
        });

        setBookingData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch cafe booking", error);
      } finally {
        setLoading(false);
      }
    };

    getRoomBooking();
  }, [userAuth, adminAuth, cafeRoom, currentPage, bookingData.pageSize]);

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
