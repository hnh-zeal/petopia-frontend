"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { adminColumns, sitterColumns, userColumns } from "./columns";
import { useEffect, useState } from "react";
import { fetchCareAppointments } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState, userAuthState } from "@/states/auth";
import Loading from "@/pages/loading";
import { PetSitter } from "@/types/api";

export const CareAppointmentClient = ({
  isAdmin = false,
  petSitter,
}: {
  isAdmin: Boolean;
  petSitter?: PetSitter;
}) => {
  const userAuth = useRecoilValue(userAuthState);
  const adminAuth = useRecoilValue(adminAuthState);
  const [appointmentsData, setAppointmentsData] = useState({
    careAppointments: [],
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
        const adminToken = adminAuth?.accessToken;
        const userId = userAuth?.user?.id || null;
        const userToken = userAuth?.accessToken;
        const petSitterId = petSitter ? petSitter.id : null;
        const data = await fetchCareAppointments(
          {
            page: currentPage,
            pageSize: appointmentsData.pageSize,
            ...(petSitterId && { petSitterId }),
            ...(userId && { userId }),
          },
          (adminToken as string) || userToken
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
  }, [userAuth, adminAuth, currentPage, petSitter, appointmentsData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        {isAdmin && (
          <>
            {!petSitter && (
              <>
                <div className="flex items-start justify-between gap-3">
                  <Heading title="Care Appointments" />
                </div>
                <Separator />
              </>
            )}
          </>
        )}
        {!loading && (
          <DataTable
            searchKey="name"
            columns={
              petSitter ? sitterColumns : isAdmin ? adminColumns : userColumns
            }
            data={appointmentsData.careAppointments}
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
