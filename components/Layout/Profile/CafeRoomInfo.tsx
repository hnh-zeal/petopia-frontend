"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/router";
import { RoomSlotsClient } from "@/components/Tables/room-slots-tables/client";
import { CafeBookingClient } from "@/components/Tables/cafe-booking-tables/client";

export default function CafeRoomInfo({ cafeRoom }: any) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(cafeRoom.isActive);
  const handleStatusToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Cafe Room Details" />
        <div className="flex items-center gap-10">
          <Switch checked={isActive} onCheckedChange={handleStatusToggle} />
          <Button
            onClick={() => router.push(`/admin/pet-cafe/${cafeRoom.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>
      <Separator />

      {/* Tabs Section */}
      <Tabs defaultValue="room-info">
        <TabsList className="border-b space-x-10">
          <TabsTrigger value="room-info" className="p-2">
            Room Information
          </TabsTrigger>
          <TabsTrigger value="slots" className="p-2">
            Available Room Slots
          </TabsTrigger>
          <TabsTrigger value="appointments" className="p-2">
            Room Booking
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-220px)] pr-4">
          <TabsContent value="room-info">
            <Card className="p-5 my-6">
              {/* <AvailableSlotsClient doctor={doctor} /> */}
            </Card>
          </TabsContent>

          {/* Available Slots Tab */}
          <TabsContent value="slots">
            <div className="py-2 my-4">
              <RoomSlotsClient cafeRoom={cafeRoom} />
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="py-2 my-4">
              <CafeBookingClient isAdmin={true} cafeRoom={cafeRoom} />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </>
  );
}
