"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { adminColumns, userColumns } from "./columns";
import { useEffect, useState } from "react";
import { fetchCareAppointments } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState, userAuthState } from "@/states/auth";

export const CareAppointmentClient = ({ isAdmin = false }) => {
  const router = useRouter();

  const userAuth = useRecoilValue(userAuthState);
  const adminAuth = useRecoilValue(adminAuthState);
  const [appointmentsData, setAppointmentsData] = useState({
    careAppointments: [],
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
        const userId = userAuth?.user?.id || null;
        const userToken = userAuth?.accessToken;
        const adminToken = adminAuth?.accessToken;
        const data = await fetchCareAppointments(
          {
            page: currentPage,
            pageSize: appointmentsData.pageSize,
            userId,
          },
          userToken || (adminToken as string)
        );

        setAppointmentsData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch care appointments", error);
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [userAuth, adminAuth, currentPage, appointmentsData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      {isAdmin && (
        <>
          <div className="flex items-start justify-between">
            <Heading title="Care Appointments" />
          </div>
          <Separator />
        </>
      )}
      {!loading && (
        <DataTable
          searchKey="name"
          columns={isAdmin ? adminColumns : userColumns}
          data={appointmentsData.careAppointments}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={appointmentsData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};
