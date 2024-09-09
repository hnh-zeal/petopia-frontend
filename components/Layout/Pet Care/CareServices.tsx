import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { truncate } from "@/utils/truncate";
import { PetClinic } from "@/constants/data";
import { Cat, ChevronDown, Search } from "lucide-react";

export default function CareServices({ servicesData }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clinics, setClinics] = useState(servicesData.clinics || []);

  useEffect(() => {
    const filteredClinics = servicesData.clinics.filter((clinic: any) => {
      return (
        clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ""
      );
    });
    setClinics(filteredClinics);
  }, [searchTerm, servicesData.clinics]);

  const router = useRouter();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Centers and Clinics</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clinics.length > 0 ? (
            clinics.map((clinic: PetClinic) => (
              <Card key={clinic.id} className="overflow-hidden">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      {/* <Image
                      src={clinic.image || ""}
                      alt={clinic.name}
                      width={50}
                      height={50}
                      className="text-blue-500"
                    /> */}
                      <Cat />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">
                      {clinic.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {truncate(clinic.description, 150)}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-end p-4 pt-0">
                  <Button
                    variant="link"
                    onClick={() => router.push(`/pet-clinics/${clinic.id}`)}
                  >
                    See More
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No Results.</p>
          )}
        </div>
      </div>
    </>
  );
}
