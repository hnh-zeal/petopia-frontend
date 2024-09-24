"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchRoomSlots } from "@/pages/api/api";
import { CafeRoom } from "@/types/api";

export const RoomSlotsClient = ({ cafeRoom }: { cafeRoom: CafeRoom }) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotData, setSlotData] = useState({
    slots: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 10,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchRoomSlots({
          roomId: cafeRoom.id,
          page: currentPage,
          pageSize: slotData.pageSize,
        });
        setSlotData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch ", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [cafeRoom, currentPage, slotData.pageSize]);

  return (
    <div className="flex flex-col space-y-3">
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={slotData.slots}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={slotData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </div>
  );
};
