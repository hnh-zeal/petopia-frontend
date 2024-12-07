import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { truncate } from "@/utils/truncate";
import { Phone, Search } from "lucide-react";
import { CafeRoom } from "@/types/api";
import { motion } from "framer-motion";

export default function CafeRooms({ cafeRooms }: { cafeRooms: CafeRoom[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(cafeRooms || []);

  useEffect(() => {
    const filteredRooms = cafeRooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRooms(filteredRooms);
  }, [searchTerm, cafeRooms]);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-black mb-8"
        >
          Pet Cafe Rooms
        </motion.h1>
        <Separator className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="relative w-full max-w-xl">
            <Input
              type="text"
              placeholder="Search cafe room..."
              className="w-full px-4 py-3 rounded-full border-2 border-[#00b2d8] focus:outline-none focus:ring-2 focus:ring-[#00b2d8] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute h-5 w-5 right-3 top-2.5 text-indigo-400" />
          </div>
          {/* <Button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 flex items-center">
            <Filter className="mr-2 h-4 w-4" size={18} />
            Filter
          </Button> */}
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 rounded-lg">
                  <Image
                    src={room.mainImage || "/Pet Cafe/cafeRoom.jpg"}
                    alt={room.name}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                      {room.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {truncate(room.description, 100)}
                    </p>

                    <div className="flex items-center text-gray-500 mb-2">
                      <span className="text-lg font-bold">
                        $ {room.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-2">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>{room.contact || "(555) 123-4567"}</span>
                    </div>
                    {/* <div className="flex items-center">
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
                    </div> */}
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4">
                    <Button
                      className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6] text-white py-2 rounded-md"
                      onClick={() => router.push(`/pet-cafe/rooms/${room.id}`)}
                    >
                      View details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-3 text-center text-gray-500 text-xl mt-8"
            >
              No room found. Please try a different search term.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
