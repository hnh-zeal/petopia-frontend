import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";

const rooms = [
  {
    id: 1,
    name: "Cozy Cat Corner",
    price: 25,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Puppy Playroom",
    price: 30,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Bunny Burrow",
    price: 20,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Hamster Haven",
    price: 15,
    image: "/placeholder.svg?height=200&width=300",
  },
];

export default function RoomBooking() {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Pet Cafe Booking</h1>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <div className="flex-grow space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose a Room
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className={`overflow-hidden cursor-pointer transition-shadow hover:shadow-lg ${selectedRoom === room.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <p className="text-gray-600">${room.price} / hour</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:w-96 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Booking Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Input id="date" type="date" className="pl-10" />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <RadioGroup defaultValue="1h" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1h" id="1h" />
                      <Label htmlFor="1h">1h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2h" id="2h" />
                      <Label htmlFor="2h">2h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3h" id="3h" />
                      <Label htmlFor="3h">3h</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <div className="relative">
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="pl-10"
                    />
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold">
                    $
                    {selectedRoom
                      ? rooms.find((r) => r.id === selectedRoom)?.price
                      : 0}
                  </span>
                </div>
              </div>
              <Button className="w-full">Book Now</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
