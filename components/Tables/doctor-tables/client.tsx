"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { fetchDoctors } from "@/pages/api/api";
import Loading from "@/pages/loading";
import { Doctor } from "@/types/api";
import { useFetchData } from "@/hooks/useFetchData";

export const DoctorClient = () => {
  const router = useRouter();

  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<Doctor>(fetchDoctors, 1, 5);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Doctors" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/doctors/create`)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
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
    </>
  );
};
