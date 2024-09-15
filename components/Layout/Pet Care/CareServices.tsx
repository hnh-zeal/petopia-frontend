import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { truncate } from "@/utils/truncate";
import { Cat, ChevronDown, Search, Star } from "lucide-react";
import { CareService } from "@/types/api";
import Image from "next/image";

export default function CareServices({ servicesData }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState(servicesData.careServices || []);

  useEffect(() => {
    const filteredServices = servicesData.careServices.filter((clinic: any) => {
      return (
        clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ""
      );
    });
    setServices(filteredServices);
  }, [searchTerm, servicesData.careServices]);

  const router = useRouter();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Pet Care Services</h1>
        <Separator />
        <div className="flex gap-4 my-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search by name, specialty ..."
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
          {services.length > 0 ? (
            services.map((service: CareService) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    // src={service.mainImage}
                    src="/PetCare/petCareService.jpg"
                    alt={service.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl text-pretty font-semibold text-primary mb-2">
                    {service.name}
                  </h2>
                  <p className="text-sm text-pretty text-gray-600 mb-4">
                    {truncate(service.description, 200)}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < service?.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({service?.reviews} reviews)
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="justify-end p-4 pt-0">
                  <Button
                    variant="default"
                    onClick={() =>
                      router.push(`/pet-care/services/${service.id}`)
                    }
                  >
                    View details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No Services.</p>
          )}
        </div>
      </div>
    </>
  );
}
