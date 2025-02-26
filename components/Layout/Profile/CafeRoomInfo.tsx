"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/router";
import { RoomSlotsClient } from "@/components/Tables/room-slots-tables/client";
import { CafeBookingClient } from "@/components/Tables/cafe-booking-tables/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Home,
  Info,
  Camera,
  Edit,
  PawPrint,
  FileText,
} from "lucide-react";
import { CafeRoom } from "@/types/api";
import { fetchCafeRoomByID, updateCafeRoomByID } from "@/pages/api/api";
import { toast } from "@/components/ui/use-toast";

interface CafeRoomInfoProps {
  cafeRoom: CafeRoom;
}

export default function CafeRoomInfo({ cafeRoom }: CafeRoomInfoProps) {
  const router = useRouter();
  const [roomData, setRoomData] = useState(cafeRoom);
  const [isActive, setIsActive] = useState(cafeRoom.isActive);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateCafeRoomByID(cafeRoom.id, {
        isActive: !isActive,
      });
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: `${data.message}`,
        });
        const roomData = await fetchCafeRoomByID(cafeRoom.id);
        setRoomData(roomData);
      }
    } finally {
      setLoading(false);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex flex-row justify-between gap-4">
            <Heading title={`${cafeRoom.name} - Room No.${cafeRoom.roomNo}`} />
            <div className="flex items-center">
              <Badge variant={`${isActive ? "success" : "destructive"}`}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Switch
                disabled={loading}
                checked={isActive}
                onCheckedChange={handleStatusToggle}
                aria-label="Toggle room active status"
              />
            </div>
            <Button
              onClick={() =>
                router.push(`/admin/pet-cafe/cafe-rooms/${cafeRoom.id}/edit`)
              }
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Room
            </Button>
          </div>
        </div>
        <Separator className="my-6" />

        <ScrollArea className="h-[calc(100vh-240px)] pr-4">
          <Tabs defaultValue="room-info">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="room-info">Room Information</TabsTrigger>
              <TabsTrigger value="slots">Available Room Slots</TabsTrigger>
              <TabsTrigger value="appointments">Room Booking</TabsTrigger>
            </TabsList>

            <TabsContent value="room-info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="mr-2" />
                      Room Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[cafeRoom.mainImage, ...cafeRoom.images].map(
                        (image, index) => (
                          <motion.div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Image
                              src={image || `/default-pet-cafe.png`}
                              alt={`Room image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                            {index === 0 && (
                              <Badge className="absolute top-2 left-2 bg-purple-500">
                                Main Image
                              </Badge>
                            )}
                          </motion.div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="mr-2" />
                      Room Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 mr-2 " />
                        <span className="font-semibold">Room Number:</span>
                        <span className="ml-2">{cafeRoom.roomNo}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 " />
                        <span className="font-semibold">Price:</span>
                        <span className="ml-2">${cafeRoom.price}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 " />
                        <span className="font-semibold">Description:</span>
                        <span className="ml-2">{cafeRoom.description}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PawPrint className="mr-2" />
                      Pets in Room
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {cafeRoom.pets.map((pet) => (
                        <motion.div
                          key={pet.id}
                          className="flex flex-col items-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative w-20 h-20 mb-2">
                            <Image
                              src={pet.imageUrl || `/default-cafe-pet.png`}
                              alt={pet.name}
                              fill
                              objectFit="cover"
                              className="rounded-full"
                            />
                          </div>
                          <span className="font-semibold text-center">
                            {pet.name}
                          </span>
                          <span className="capitalize text-sm text-gray-500">
                            {pet.petType}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="slots">
              <div className="px-4">
                <RoomSlotsClient cafeRoom={cafeRoom} />
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardContent className="p-6">
                  <CafeBookingClient isAdmin={true} cafeRoom={cafeRoom} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </motion.div>
    </div>
  );
}
