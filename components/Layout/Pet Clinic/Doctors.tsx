"use client";

import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Doctor } from "@/types/api";
import { Filter, Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function Doctors({
  doctorsData,
}: {
  doctorsData: { data: Doctor[] };
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState(doctorsData.data || []);

  useEffect(() => {
    const filteredDoctors = doctorsData.data.filter((doctor: Doctor) => {
      return doctor.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setDoctors(filteredDoctors);
  }, [searchTerm, doctorsData.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-black-500 mb-8"
        >
          Find Your Perfect Pet Doctor
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
              placeholder="Search clinics..."
              className="w-full px-4 py-3 rounded-full border-2 border-[#00b2d8] focus:outline-none focus:ring-2 focus:ring-[#00b2d8] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute h-5 w-5 right-3 top-2.5 text-[#00b2d8]" />
          </div>
          {/* <Button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 flex items-center">
            <Filter className="mr-2 h-4 w-4" size={18} />
            Filter
          </Button> */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.length > 0 ? (
            doctors.map((doctor: Doctor, index: number) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image
                          src={doctor.profileUrl || "/default-doctor.png"}
                          alt={doctor.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-indigo-900">
                          {doctor.name}
                        </h2>
                        <p className="text-gray-600 mb-2">
                          {doctor.clinic.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {doctor.specialties?.map(
                            (specialty: string, index: number) => (
                              <Badge
                                key={index}
                                variant="default"
                                className="bg-[#00b2d8] hover:bg-[#2cc4e6] text-white hover:text-white "
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
                    {/* <Button variant="ghost">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button> */}
                    <Button
                      variant="ghost"
                      onClick={() =>
                        router.push(`/pet-clinics/doctors/${doctor.id}`)
                      }
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-3 text-center text-gray-600 text-xl mt-8"
            >
              No doctors found.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
