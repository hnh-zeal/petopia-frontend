import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { truncate } from "@/utils/truncate";
import { ChevronDown, Search, Star } from "lucide-react";

interface CafeRoom {
  id: string;
  name: string;
  description: string;
  mainImage: string;
  images: string[];
  price: number;
  originalPrice: number;
  promotion: string;
  rating: number;
  reviews: number;
}

export default function CafeRooms({
  cafeRoomData,
}: {
  cafeRoomData: { rooms: CafeRoom[] };
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(cafeRoomData.rooms || []);

  useEffect(() => {
    const filteredRooms = cafeRoomData.rooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRooms(filteredRooms);
  }, [searchTerm, cafeRoomData.rooms]);

  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Cafe Rooms</h1>
      <Separator />
      <div className="flex gap-4 my-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search by room name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Button>
          Filter <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  // src={room.mainImage}
                  src="/Pet Cafe/cafeRoom.jpg"
                  alt={room.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-primary mb-2">
                  {room.name}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {truncate(room.description, 200)}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-lg font-bold">
                      ${room.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${room.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-green-600">
                    {room.promotion}
                  </span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < room.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({room.reviews} reviews)
                  </span>
                </div>
              </CardContent>
              <CardFooter className="justify-end p-4 pt-0">
                <Button
                  variant="default"
                  onClick={() => router.push(`/pet-cafe/rooms/${room.id}`)}
                >
                  View details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No rooms found.
          </p>
        )}
      </div>
    </div>
  );
}
