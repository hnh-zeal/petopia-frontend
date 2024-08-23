"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchPetSitters } from "@/pages/api/api";

export const PetSitterClient = () => {
  const router = useRouter();

  const [petSittersData, setPetSittersData] = useState({
    petSitters: [],
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
        const data = await fetchPetSitters(
          currentPage,
          petSittersData.pageSize
        );
        setPetSittersData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Sitters", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [currentPage, petSittersData.pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Pet Sitters" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/pet-sitters/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      {!loading && (
        <DataTable
          searchKey="name"
          columns={columns}
          data={petSittersData.petSitters}
          // onClickRow={(id) => router.push(`/admin/petSitters/${id}`)}
          totalPages={petSittersData.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {loading && <div>Loading...</div>}
    </>
  );
};
