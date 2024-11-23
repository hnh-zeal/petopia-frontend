"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { fetchAdmins } from "@/pages/api/api";
import { Admin } from "@/types/api";
import { useFetchData } from "@/hooks/useFetchData";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import Loading from "@/pages/loading";

export const AdminClient = () => {
  const router = useRouter();
  const adminAuth = useRecoilValue(adminAuthState);

  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<Admin>(fetchAdmins, 1, 5, adminAuth?.accessToken);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Admins" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/admins/create`)}
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
