"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { fetchPetClinics } from "@/pages/api/api";
import Loading from "@/pages/loading";
import { useFetchData } from "@/hooks/useFetchData";
import { Clinic } from "@/types/api";

export const PetClinicClient = () => {
  const router = useRouter();

  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<Clinic>(fetchPetClinics, 1, 6);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Pet Centers" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/pet-clinic/pet-centers/create`)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {loading && (
        <div className="flex items-center justify-center h-[calc(100vh-220px)]">
          <Loading />
        </div>
      )}
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={data}
          // onClickRow={(id) => router.push(`/admin/petClinics/${id}`)}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};
