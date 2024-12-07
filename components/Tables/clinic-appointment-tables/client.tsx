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
import Loading from "@/pages/loading";

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
    pageSize: 6,
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
            {!doctor && (
              <>
                <div className="flex items-start justify-between gap-3">
                  <Heading title="Clinic Appointments" />
                </div>
                <Separator />
              </>
            )}
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
        {loading && (
          <div className="flex items-center justify-center h-[calc(100vh-220px)]">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};
