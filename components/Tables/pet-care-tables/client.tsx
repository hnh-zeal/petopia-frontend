"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchServices } from "@/pages/api/api";
import Loading from "@/pages/loading";

export const CareServicesClient = () => {
  const router = useRouter();

  const [servicesData, setServicesData] = useState({
    careServices: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchServices({
          page: currentPage,
          pageSize: servicesData.pageSize,
        });
        setServicesData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [currentPage, servicesData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Pet Care Services" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/pet-care/services/create`)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={servicesData.careServices}
          // onClickRow={(id) => router.push(`/admin/services/${id}`)}
          totalPages={servicesData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && (
        <div className="flex items-center justify-center h-[calc(100vh-220px)]">
          <Loading />
        </div>
      )}
    </>
  );
};
