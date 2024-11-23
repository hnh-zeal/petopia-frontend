import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  MessageCircle,
  Cat,
  Siren,
  PawPrint,
  Cake,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { useRouter } from "next/router";
import { CafePet, CafeRoom } from "@/types/api";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CafeRoomDetailProps {
  cafeRoom: CafeRoom;
}

export default function CafeRoomDetails({ cafeRoom }: CafeRoomDetailProps) {
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const auth = useRecoilValue(userAuthState);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-3xl font-bold">
          {cafeRoom.name} (Room No: {cafeRoom.roomNo})
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 space-x-4">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
          <section id="carousel" className="mb-8">
            {[cafeRoom.mainImage, ...cafeRoom.images]?.length && (
              <Carousel className="gap-3">
                <CarouselContent>
                  {[cafeRoom.mainImage, ...cafeRoom.images].map(
                    (image: string, index: number) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/2"
                      >
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex relative aspect-square items-center justify-center ">
                              <Image
                                src={image}
                                alt={`${cafeRoom.name} - Image ${index + 1}`}
                                fill
                                objectFit="cover"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </section>

          <section id="room-info" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Room Information
            </h2>
            <p className="text-gray-700 text-pretty">{cafeRoom.description}</p>

            <div className="mt-4">
              <span className="text-2xl font-bold">
                Price: ${cafeRoom.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500 line-through ml-2">
                ${cafeRoom.price.toFixed(2)}
              </span>
              <span className="text-sm text-green-600">
                {cafeRoom.promotion}
              </span>
            </div>
          </section>

          <section id="pet-info" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-800">Pets</h2>
              <Link
                href="/pet-cafe/pets"
                className="text-pink-600 hover:underline"
              >
                SEE OTHER PETS →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cafeRoom.pets.slice(0, 2).map((pet: CafePet) => (
                <Card
                  key={pet.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white p-6"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-6">
                      {/* Left side - Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="h-24 w-24 rounded-full overflow-hidden">
                          <Image
                            src={pet.imageUrl || "/placeholder-pet.jpg"}
                            alt={pet.name}
                            layout="fill"
                            className="rounded-full"
                            objectFit="cover"
                          />
                        </div>
                      </div>

                      {/* Right side - Basic Info */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-2xl font-bold">{pet.name}</h2>
                          <Badge className="bg-[#00b2d8] hover:bg-[#2cc4e6]">
                            <p className="capitalize">{pet.sex}</p>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <PawPrint className="h-4 w-4" />
                          <span className="capitalize">
                            {pet.petType} - {pet.breed}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Cake className="h-4 w-4" />
                          <span>
                            {pet.year} years {pet.month} months
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Full width sections */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{pet.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Home className="h-4 w-4" />
                        <span>Room: {cafeRoom.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="rules" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Rules & Policy
            </h2>
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Cancellation / Prepayment */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">ℹ️</span>
                  <div>
                    <h3 className="font-bold">Cancellation/ prepayment</h3>
                    <p>
                      Cancellation and prepayment policies vary according to
                      accommodation type. Please{" "}
                      <a href="#" className="text-blue-600">
                        enter the dates of your stay
                      </a>{" "}
                      and check the conditions of your required option.
                    </p>
                  </div>
                </div>

                {/* Children and Beds */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🔞</span>
                  <div>
                    <h3 className="font-bold">Age restriction</h3>
                    <p>Children under 18 must be supervised by the parents.</p>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🐾</span>
                  <div>
                    <h3 className="font-bold">Pets</h3>
                    <p>No Outside Pets are allowed.</p>
                  </div>
                </div>

                {/* Foods or Drinks */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🍔</span>
                  <div>
                    <h3 className="font-bold">Food and Drinks</h3>
                    <p>No Outside Foods or Drinks are allowed.</p>
                  </div>
                </div>

                {/* Sanitization */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">💦</span>
                  <div>
                    <h3 className="font-bold">Sanitation Rules</h3>
                    <p>
                      Customers are required to sanitize their hands before and
                      after interacting with the pets.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              For more information, please contact
            </h2>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-pink-600 mb-2">
                  Pet Cafe Department
                </h3>
                {cafeRoom.operatingHours?.map((day: any, index: number) => (
                  <p key={index}>{day.dow} from 7:00 AM to 4:00 PM.</p>
                ))}

                <p>Opening Hours: 7:00 AM to 4:00 PM.</p>
                <div className="mt-4">
                  <p>
                    <span className="font-semibold">Tel:</span>{" "}
                    {cafeRoom.contact}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 xl:w-1/4 order-1 lg:order-2 space-y-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#room-info"
                      className="flex items-center text-pink-600 hover:underline"
                    >
                      <HeartPulse className="mr-2 h-5 w-5" />
                      Room Information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pet-info"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <Cat className="mr-2 h-5 w-5" />
                      Pets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#contact"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <Siren className="mr-2 h-5 w-5" />
                      Rules
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#contact"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <div className="top-20 space-y-4">
              {auth !== undefined ? (
                <Button
                  className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6]"
                  onClick={() => {
                    router.push(`/pet-cafe/rooms/${cafeRoom.id}/booking`);
                  }}
                >
                  Book this room
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6]"
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  Register to book this room
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
