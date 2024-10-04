import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { truncate } from "@/utils/truncate";
import { Filter, Search, Star } from "lucide-react";
import { CareService, CareServicesData } from "@/types/api";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CareServices({
  servicesData,
}: {
  servicesData: CareServicesData;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<CareService[]>(
    servicesData.careServices
  );

  useEffect(() => {
    const filteredServices: CareService[] = servicesData.careServices.filter(
      (service: CareService) => {
        return (
          service.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ""
        );
      }
    );
    setServices(filteredServices);
  }, [searchTerm, servicesData.careServices]);

  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
            Pet Care Services
          </h1>
          <Separator />
          <div className="flex justify-center my-6">
            <div className="relative w-full max-w-xl">
              <Input
                type="text"
                placeholder="Search services..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute h-5 w-5 right-3 top-2.5 text-gray-400" />
            </div>
            <Button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 flex items-center">
              <Filter className="mr-2 h-4 w-4" size={18} />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service: CareService, index: number) => (
                <Card
                  key={service.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={service.mainImage || "/PetCare/petCareService.jpg"}
                        alt={service.name}
                        width={600}
                        height={600}
                        className="w-full rounded-md h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {service.name}
                      </h2>
                      <p className="text-gray-600 text-pretty mb-4">
                        {truncate(service.description, 200)}
                      </p>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={`${
                                i < Math.floor(service.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              } ${i === Math.floor(service.rating) && service.rating % 1 !== 0 ? "text-yellow-400" : ""}`}
                              fill={
                                i < Math.floor(service.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                          {service.rating} ({service.reviews} reviews)
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end p-4 pt-0">
                      <Button
                        variant="default"
                        className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
                        onClick={() =>
                          router.push(`/pet-care/services/${service.id}`)
                        }
                      >
                        View details
                      </Button>
                    </CardFooter>
                  </motion.div>
                </Card>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No Services.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
