"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchAppointmentSlots } from "@/pages/api/api";
import { Button } from "@/components/ui/button";
import CreateScheduleForm from "@/components/Forms/create-slot-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export const AvailableSlotsClient = ({ doctor }: any) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [slotData, setSlotData] = useState({
    slots: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 10,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: any) => {
    setIsOpen(open);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchAppointmentSlots(
          currentPage,
          slotData.pageSize,
          doctor.id
        );
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
  }, [doctor, currentPage, slotData.pageSize]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold">Available Slots</h2>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="text-xs md:text-sm"
              onClick={() => setIsOpen(true)}
            >
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Available Slots</DialogTitle>
              {/* <DialogDescription>
                Choose Start Date and End Date
              </DialogDescription> */}
            </DialogHeader>
            <CreateScheduleForm onCancel={handleCancel} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
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
