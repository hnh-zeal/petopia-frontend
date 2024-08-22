"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/pages/api/api";
import { adminAuthState } from "@/states/auth";
import { useRecoilState } from "recoil";

export const UserClient = () => {
  const router = useRouter();

  const [usersData, setUsersData] = useState({
    users: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [auth, setAuth] = useRecoilState(adminAuthState);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(
          auth?.accessToken as string,
          currentPage,
          usersData.pageSize
        );
        setUsersData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [currentPage, usersData.pageSize, auth?.accessToken]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

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
          data={usersData.users}
          // onClickRow={(id) => router.push(`/admin/users/${id}`)}
          totalPages={usersData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};
