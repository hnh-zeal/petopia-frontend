import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { PetSitter } from "@/types/api";
import { Calendar, Filter, Info, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PetSitters({ petSitters }: any) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-gray-900 mb-10"
        >
          Find a Pet Sitter
        </motion.h1>
        <Separator />
        <div className="flex justify-center my-6">
          <div className="relative w-full max-w-xl">
            <Input
              type="text"
              placeholder="Search by name, specialty ..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute h-5 w-5 right-3 top-2.5 text-gray-400" />
          </div>
          <Button className="ml-4 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300 flex items-center">
            <Filter className="mr-2 h-4 w-4" size={18} />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sitters.length > 0 ? (
            sitters?.map((sitter: PetSitter, index: number) => (
              <Card
                key={sitter.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CardContent className="p-6">
                    <div className="relative">
                      <Image
                        src={sitter?.profileUrl || ""}
                        alt={sitter.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-white rounded-bl-lg px-2 py-1 m-2">
                        <div className="flex items-center">
                          <Star
                            className="text-yellow-400 mr-1"
                            size={16}
                            fill="currentColor"
                          />
                          <span className="text-sm font-semibold">
                            {sitter.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {sitter.name}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {sitter.reviews} reviews
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {sitter.specialties?.map(
                          (specialty: string, index: number) => (
                            <Badge
                              // variant="secondary"
                              key={index}
                              className="mt-2 bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                            >
                              {specialty}
                            </Badge>
                          )
                        )}
                      </div>
                      <p className="text-gray-800 font-semibold mb-4">
                        {/* ${sitter.price}/hour */}
                        {sitter.about}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4 flex justify-between">
                    <Button className="flex items-center justify-center w-1/2 bg-purple-500 text-white py-2 rounded-full hover:bg-purple-600 transition duration-300 mr-2">
                      <Calendar className="mr-2 h-4 w-4" size={18} />
                      Book
                    </Button>
                    <Button className="flex items-center justify-center w-1/2 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 transition duration-300">
                      <Info className="mr-2 h-4 w-4" size={18} />
                      Details
                    </Button>
                  </CardFooter>
                </motion.div>
              </Card>
            ))
          ) : (
            <p>No Results.</p>
          )}
        </div>
      </div>
    </div>
  );
}
