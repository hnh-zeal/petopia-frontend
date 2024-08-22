"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useEffect, useState } from "react";

async function fetchDoctors(page: number, pageSize: number) {
  // Call API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctors?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  const data = await response.json();
  return data;
}

export const DoctorClient = () => {
  const router = useRouter();

  const [doctorsData, setDoctorsData] = useState({
    doctors: [],
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
        const data = await fetchDoctors(currentPage, doctorsData.pageSize);
        setDoctorsData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [currentPage, doctorsData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Doctors" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/doctors/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={doctorsData.doctors}
          // onClickRow={(id) => router.push(`/admin/doctors/${id}`)}
          totalPages={doctorsData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};
