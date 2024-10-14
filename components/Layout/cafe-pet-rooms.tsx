import React, { useState } from "react";
import {
  Card,
  CardFooter,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Pagination from "../Tables/pagination";
import { Separator } from "@/components/ui/separator";
import { Heading } from "../ui/heading";
import { Plus, Star } from "lucide-react";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";
import { CafeRoom, RoomsData } from "@/types/api";

export default function CafeRooms({ roomData }: { roomData: RoomsData }) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Cafe Rooms" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/pet-cafe/cafe-rooms/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] rounded-md px-3">
        <div className="container mx-auto p-4">
          {roomData?.rooms.length === 0 ? (
            <p>No room found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomData?.rooms?.map((room: CafeRoom) => (
                <Card key={room.id} className="overflow-hidden">
                  <Image
                    src={room.mainImage || `/default-pet-cafe.png`}
                    alt={room.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>
                        {room.name} - Room No.{room.roomNo}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {room.description.substring(0, 150)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          ${room.price}
                        </span>
                      </div>
                      {/* <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                          (0 reviews)
                        </span>
                      </div> */}
                    </div>
                    {/* <p className="text-sm text-gray-500 mt-2">
                      Winter Promotion (1 Nov to 31 Dec) - 5% off
                    </p> */}
                  </CardContent>
                  <CardFooter className="bg-gray-50 flex justify-between">
                    <div
                      className="flex -space-x-2 hover:cursor-pointer"
                      onClick={() => router.push(`/admin/pet-cafe/pets`)}
                    >
                      {room?.pets
                        ?.slice(0, 3)
                        .map((pet) => (
                          <Image
                            key={pet.id}
                            src={pet.imageUrl || `/default-cafe-pet.png`}
                            alt={pet.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        ))}
                      {room?.pets?.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                          +{room?.pets?.length - 3}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="default"
                      onClick={() =>
                        router.push(`/admin/pet-cafe/cafe-rooms/${room.id}`)
                      }
                    >
                      View Details
                    </Button>
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
                totalPages={roomData?.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
