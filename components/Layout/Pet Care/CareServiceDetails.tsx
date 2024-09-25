import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartPulse, MessageCircle, Star, Cat, Siren } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/router";

export default function ServiceDetails({ service }: any) {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-3xl font-bold">{service.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 space-x-4">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
          <section id="carousel" className="mb-8">
            <Carousel className="gap-3">
              <CarouselContent>
                {service.images?.map((image: string, index: number) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/2"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex relative aspect-square items-center justify-center ">
                          <Image
                            src={image}
                            alt={`${service.name} - Image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>

          <section id="room-info" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Service Information
            </h2>
            <p className="text-gray-700 text-pretty">{service.description}</p>

            <div className="mt-4">
              <span className="text-2xl font-bold">
                Price: ${service?.price}
              </span>
              <span className="text-lg text-gray-500 line-through ml-2">
                ${service.price}
              </span>
              <span className="text-sm text-green-600">
                {service.promotion}
              </span>
            </div>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < service.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                ({service.reviews} reviews)
              </span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Room Details:</h3>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Amenities:</h3>
              <ul className="list-disc list-inside">
                {service.amenities?.map((amenity: string, index: number) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="pet-sitter-info" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-800">
                Pet Sitters
              </h2>
              <Link
                href="/pet-care/pet-sitters"
                className="text-pink-600 hover:underline"
              >
                SEE OTHER PET SITTERS →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.petSitters?.map((petSitter: any) => (
                <Card key={petSitter.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {petSitter.imageUrl && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={petSitter.imageUrl}
                          alt={petSitter.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">
                        {petSitter.name}
                      </div>
                      <p className=" text-base">
                        Pet Type & Breed: {petSitter.type}
                      </p>
                      <p className="text-base">
                        Age: {petSitter.age} years old
                      </p>
                      <p className="text-base">Sex: {petSitter.sex}</p>
                      <p className="text-base">
                        Description: {petSitter.description}
                      </p>
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
                    <h3 className="font-bold">Cancellation</h3>
                    <p>
                      Cancellation must be made one or two days before the
                      appointed date and time.
                    </p>
                  </div>
                </div>

                {/* Children and Beds */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">📅</span>
                  <div>
                    <h3 className="font-bold">Appointment Timing</h3>
                    <p>
                      Please arrive on time for your appointment. Late arrivals
                      may result in reduced service time or rescheduling.
                    </p>
                  </div>
                </div>

                {/* Foods or Drinks */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">💼</span>
                  <div>
                    <h3 className="font-bold">Drop-off and Pickup</h3>
                    <p>
                      Pets must be dropped off and picked up within the
                      allocated time. A late fee may be applied for pickups
                      beyond the scheduled time.
                    </p>
                  </div>
                </div>

                {/* Sanitization */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🚫</span>
                  <div>
                    <h3 className="font-bold">No Outside Pet Items</h3>
                    <p>
                      Only approved pet items (e.g., leashes, toys) are allowed
                      during the care session. No outside food or treats are
                      permitted unless medically necessary.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-xl mr-4">📞</span>
                  <div>
                    <h3 className="font-bold">Emergency Contact</h3>
                    <p>
                      Owners must provide emergency contact details at the time
                      of the appointment. In case of emergencies, the provided
                      contact will be immediately notified.
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
                  Pet Care Services Department
                </h3>
                {service.operatingHours?.map((day: any, index: number) => (
                  <p key={index}>{day.dow} from 7:00 AM to 4:00 PM.</p>
                ))}

                <p>Opening Hours: 7:00 AM to 4:00 PM.</p>
                <div className="mt-4">
                  <p>
                    <span className="font-semibold">Tel:</span>{" "}
                    {service.contact}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 xl:w-1/4 order-1 lg:order-2">
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
                      Service Information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pet-info"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <Cat className="mr-2 h-5 w-5" />
                      Pet Sitters
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

            <Button
              className="w-full bg-blue-900 hover:bg-blue-800"
              onClick={() =>
                router.push(`/pet-care/services/${service.id}/appointment`)
              }
            >
              Make an appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
