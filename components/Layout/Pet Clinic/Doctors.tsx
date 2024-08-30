import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Doctor } from "@/types/api";
import { CalendarIcon, ChevronDown, Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Doctors({ doctorsData }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState(doctorsData.doctors || []);

  useEffect(() => {
    const filteredDoctors = doctorsData.doctors.filter((doctor: any) => {
      return (
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        doctor.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
      );
    });
    setDoctors(filteredDoctors);
  }, [searchTerm, doctorsData.doctors]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find a doctor</h1>
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
        {doctors.length > 0 ? (
          doctors.map((doctor: Doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-10">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={doctor.profileUrl || ""}
                      alt={doctor.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{doctor.name}</h2>
                    <p className="text-gray-600">{doctor.clinic.name}</p>
                    {doctor.specialties?.map((specialty: string) => (
                      <>
                        <Badge variant="secondary" className="mt-2">
                          {specialty}
                        </Badge>
                      </>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-between">
                <Button variant="ghost" className="text-blue-600">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  make an appointment
                </Button>
                <Button variant="ghost" className="text-blue-600">
                  <Info className="mr-2 h-4 w-4" />
                  details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No Results.</p>
        )}
      </div>
    </div>
  );
}
