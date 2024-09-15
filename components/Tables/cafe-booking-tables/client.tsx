"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { adminColumns, userColumns } from "./columns";
import { useEffect, useState } from "react";
import { fetchRoomBooking } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState, userAuthState } from "@/states/auth";

export const CafeBookingClient = ({ isAdmin = false }) => {
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
    const getAppointments = async () => {
      setLoading(true);
      try {
        const userId = userAuth?.user?.id || null; // Extract userId only once
        const userToken = userAuth?.accessToken;
        const adminToken = adminAuth?.accessToken;
        const data = await fetchRoomBooking(
          {
            page: currentPage,
            pageSize: bookingData.pageSize,
            userId,
          },
          userToken || (adminToken as string)
        );

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

    getAppointments();
  }, [userAuth, adminAuth, currentPage, bookingData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      {isAdmin && (
        <>
          <div className="flex items-start justify-between">
            <Heading title="Cafe Room Booking" />
            <Button
              className="text-xs md:text-sm"
              onClick={() => router.push(`/admin/pet-clinic/create`)}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
          <Separator />
        </>
      )}
      {!loading && (
        <DataTable
          searchKey="room"
          columns={isAdmin ? adminColumns : userColumns}
          data={bookingData.data}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={bookingData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};
