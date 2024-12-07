"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchUsers } from "@/pages/api/api";
import Loading from "@/pages/loading";
import { User } from "@/types/api";
import { useFetchData } from "@/hooks/useFetchData";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";

export const UserClient = () => {
  const adminAuth = useRecoilValue(adminAuthState);
  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<User>(fetchUsers, 1, 6, adminAuth?.accessToken);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Users" />
      </div>
      <Separator />
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={data}
          // onClickRow={(id) => router.push(`/admin/users/${id}`)}
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
