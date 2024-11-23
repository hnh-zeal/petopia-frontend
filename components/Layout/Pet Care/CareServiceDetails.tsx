import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartPulse, MessageCircle, Cat, Siren, Info } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/router";
import { CareService, PetSitter } from "@/types/api";
import { Badge } from "@/components/ui/badge";

export default function ServiceDetails({ service }: { service: CareService }) {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4">
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-3xl font-bold">{service.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 space-x-4">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
          <section id="carousel" className="mb-8">
            <Carousel className="gap-3">
              <CarouselContent>
                {[service.mainImage, ...service.images]?.map(
                  (image: string, index: number) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/2"
                    >
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex relative aspect-square items-center justify-center">
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
                  )
                )}
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

            <div className="mt-6">
              {/* Increased margin-top */}
              <span className="text-2xl font-bold">
                Price: ${service?.price}
              </span>
            </div>

            <div className="flex items-center mb-6">
              {/* {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={h-5 w-5 ${i < service.rating ? "text-yellow-400 fill-current" : "text-gray-300"}}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                ({service.reviews} reviews)
              </span> */}
            </div>

            <div className="mb-6 w-full">
              <h3 className="font-semibold text-xl mb-2">
                Additional Services:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className="flex justify-between items-center border-b my-4"
                  >
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {addOn.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {addOn.description}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      ${addOn.price}
                    </span>
                  </div>
                ))}
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.petSitters?.slice(0, 2).map((sitter: PetSitter) => (
                <>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                          <Image
                            src={sitter.profileUrl || "/default-pet-sitter.png"}
                            alt={sitter.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-indigo-900">
                            {sitter.name}
                          </h2>
                          <p className="text-gray-600 mb-2">
                            {/* {sitter.services.name} */}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sitter.specialties?.map(
                              (specialty: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="default"
                                  className="bg-indigo-100 text-indigo-800 hover:text-white hover:bg-black"
                                >
                                  {specialty}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-end">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          router.push(`/pet-care/pet-sitters/${sitter.id}`)
                        }
                      >
                        <Info className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </>
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
              className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6]"
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
