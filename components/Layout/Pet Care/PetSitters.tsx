import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { PetSitter } from "@/types/api";
import { CalendarIcon, Filter, Info, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";

export default function PetSitters({ petSitters }: any) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sitters, setPetSitters] = useState(petSitters || []);

  useEffect(() => {
    const filtered = petSitters.filter((sitter: any) => {
      return (
        sitter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        sitter.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        sitter.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
      );
    });
    setPetSitters(filtered);
  }, [searchTerm, petSitters]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center text-indigo-900 mb-8"
          >
            Find a Pet Sitter
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
                className="w-full px-4 py-3 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute h-5 w-5 right-3 top-2.5 text-indigo-400" />
            </div>
            <Button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300 flex items-center">
              <Filter className="mr-2 h-4 w-4" size={18} />
              Filter
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitters.length > 0 ? (
              sitters.map((sitter: PetSitter, index: number) => (
                <motion.div
                  key={sitter.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
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
                          <div className="flex items-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              (48 reviews)
                            </span>
                          </div>
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
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="col-span-3 text-center text-gray-600 text-xl mt-8"
              >
                No sitters found.
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
