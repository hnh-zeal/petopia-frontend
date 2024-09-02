"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { adminColumns, userColumns } from "./columns";
import { useEffect, useState } from "react";
import { fetchClinicAppointments } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";

export const CareAppointmentClient = ({ isAdmin = false }) => {
  const router = useRouter();

  const auth = useRecoilValue(userAuthState);
  const [appointments, setAppointments] = useState({
    doctors: [],
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
        const userId = auth?.user?.id || null; // Extract userId only once
        const data = await fetchClinicAppointments(
          currentPage,
          appointments.pageSize,
          userId
        );

        setAppointments((prevState) => ({
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
  }, [auth, currentPage, appointments.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      {isAdmin && (
        <>
          <div className="flex items-start justify-between">
            <Heading title="Clinic Appointments" />
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
          searchKey="name"
          columns={isAdmin ? adminColumns : userColumns}
          data={appointments.doctors}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={appointments.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};
