import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { truncate } from "@/utils/truncate";
import { Search } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center text-black mb-8"
          >
            Pet Care Services
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
                placeholder="Search services..."
                className="w-full px-4 py-3 rounded-full border-2 border-[#00b2d8] focus:outline-none focus:ring-2 focus:ring-[#00b2d8] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute h-5 w-5 right-3 top-2.5 text-gray-400" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service: CareService, index: number) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 rounded-lg">
                    <Image
                      src={service.mainImage || "/PetCare/petCareService.jpg"}
                      alt={service.name}
                      width={600}
                      height={600}
                      className="w-full rounded-md h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                        {service.name}
                      </h2>
                      <p className="text-gray-600 text-pretty mb-4">
                        {truncate(service.description, 90)}
                      </p>

                      {/* <div className="flex items-center mb-4">
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
                      </div> */}
                      <div className="flex items-center text-gray-500 mb-2">
                        <span className="text-lg font-bold">
                          $ {service.price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end p-4 pt-0">
                      <Button
                        className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6] text-white py-2 rounded-md"
                        onClick={() =>
                          router.push(`/pet-care/services/${service.id}`)
                        }
                      >
                        View details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
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
