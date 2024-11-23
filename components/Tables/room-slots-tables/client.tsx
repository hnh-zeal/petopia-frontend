"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchRoomSlots } from "@/pages/api/api";
import { CafeRoom, RoomSlot } from "@/types/api";
import Loading from "@/pages/loading";
import { useFetchData } from "@/hooks/useFetchData";
import { useCallback, useMemo } from "react";

export const RoomSlotsClient = ({ cafeRoom }: { cafeRoom: CafeRoom }) => {
  const roomQuery = useMemo(() => ({ roomId: cafeRoom.id }), [cafeRoom.id]);

  const fetchRoomSlotsMemoized = useCallback(fetchRoomSlots, []);

  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<RoomSlot>(fetchRoomSlotsMemoized, 1, 7, roomQuery);

  return (
    <div className="flex flex-col space-y-3">
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={data}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={totalPages}
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
