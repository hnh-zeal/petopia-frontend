import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CafePetPagination } from "@/types";
import Pagination from "../Tables/pagination";
import { Separator } from "@/components/ui/separator";
import { Heading } from "../ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchCafePets } from "@/pages/api/api";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditCafePetForm from "../Forms/edit-cafe-pets-form";

export default function CafePetsCards() {
  const router = useRouter();

  const [pets, setPets] = useState<CafePetPagination>({
    cafePets: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 6,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPets = async () => {
      const petsData = await fetchCafePets(currentPage, 6);
      setPets(petsData);
    };

    fetchPets();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Cafe Pets" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/pet-cafe/pets/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] rounded-md">
        <div className="container mx-auto p-4">
          {pets.cafePets.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets?.cafePets.map((pet) => (
                <Card key={pet?.id} className="shadow-lg">
                  <CardHeader>
                    <Image
                      src={pet?.imageUrl || "/dummy-cat.jpg"}
                      alt={pet?.name}
                      width="500"
                      height="500"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{pet?.name || "Sam"}</CardTitle>
                    <CardDescription className="pt-3">
                      {pet?.description || "Sam is .."}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="justify-end mt-5 space-x-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>Edit</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Update Cat Details
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Update the cats information below.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <EditCafePetForm id={Number(pet.id)} />
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Pagination
                currentPage={currentPage}
                totalPages={pets.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
