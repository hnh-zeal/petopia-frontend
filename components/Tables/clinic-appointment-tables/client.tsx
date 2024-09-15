"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { adminColumns, doctorColumns, userColumns } from "./columns";
import { useEffect, useState } from "react";
import { fetchClinicAppointments } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState, userAuthState } from "@/states/auth";
import { Doctor } from "@/types/api";

interface ClinicAppointmentProps {
  isAdmin: boolean;
  doctor?: Doctor;
}

export const ClinicAppointmentClient = ({
  isAdmin = false,
  doctor,
}: ClinicAppointmentProps) => {
  const router = useRouter();

  const userAuth = useRecoilValue(userAuthState);
  const adminAuth = useRecoilValue(adminAuthState);
  const [appointmentsData, setAppointmentsData] = useState({
    clinicAppointments: [],
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
        const doctorId = doctor ? doctor.id : null;
        console.log(doctorId);
        const data = await fetchClinicAppointments(
          {
            userId,
            doctorId,
            page: currentPage,
            pageSize: appointmentsData.pageSize,
          },
          userToken || (adminToken as string)
        );

        setAppointmentsData((prevState) => ({
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
  }, [userAuth, adminAuth, doctor, currentPage, appointmentsData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        {isAdmin && (
          <>
            <div className="flex items-start justify-between gap-3">
              {!doctor && <Heading title="Clinic Appointments" />}
              {doctor && (
                <h2 className="text-lg font-bold">Clinic Appointments</h2>
              )}

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
            searchKey="date"
            columns={
              doctor ? doctorColumns : isAdmin ? adminColumns : userColumns
            }
            data={appointmentsData.clinicAppointments}
            // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
            totalPages={appointmentsData.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {loading && <div>Loading...</div>}
      </div>
    </>
  );
};
