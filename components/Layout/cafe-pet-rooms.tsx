import React, { useState } from "react";
import {
  Card,
  CardFooter,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Pagination from "../Tables/pagination";
import { Separator } from "@/components/ui/separator";
import { Heading } from "../ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";
import { truncate } from "@/utils/truncate";

export default function CafeRoom({ roomData }: any) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Cafe Pets" />
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
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomData?.rooms.map((room: any) => (
                <Card
                  key={room?.id}
                  className="shadow-lg rounded-lg overflow-hidden"
                >
                  <Image
                    src={room?.imageUrl || "/dummy-cat.jpg"}
                    alt={room?.name}
                    width="500"
                    height="500"
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold">
                      {room.name} - Room No.{room.roomNo}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-2">
                      {truncate(room?.description)}
                    </CardDescription>
                    {/* Add pricing and promotion details here */}
                    <div className="mt-4">
                      <p className="text-red-500 font-bold">
                        {`$${room.price} `}
                        <span className="text-sm text-gray-500 line-through">
                          {room.originalPrice ? `$${room.price}` : "$15"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Winter Promotion (1 Nov to 31 Dec) - 5% off
                      </p>
                    </div>
                    {/* Add review section here */}
                    <div className="mt-3">
                      <div className="flex items-center">
                        <div className="flex text-yellow-500">
                          {/* Replace this with your star rating component */}
                          <span>&#9733;</span>
                          <span>&#9733;</span>
                          <span>&#9733;</span>
                          <span>&#9733;</span>
                          <span>&#9734;</span> {/* Empty star */}
                        </div>
                        <p className="ml-2 text-sm text-gray-600">
                          (0 reviews)
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 flex justify-around items-center">
                    <Button
                      className="w-1/4"
                      onClick={() =>
                        router.push(
                          `/admin/pet-cafe/cafe-rooms/${room.id}/edit`
                        )
                      }
                    >
                      Edit{" "}
                    </Button>
                    <Button className="w-1/3">View Details</Button>
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
