import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CafePet, CafePetData } from "@/types/api";
import { Search, Filter, Home, Cake, PawPrint } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Pets({ petsData }: { petsData: CafePetData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pets, setPets] = useState(petsData.data || []);
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);

  useEffect(() => {
    const filteredPets = petsData.data.filter((pet: CafePet) => {
      const matchesSearch =
        pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.petType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPetType = selectedPetType
        ? pet.petType === selectedPetType
        : true;

      return matchesSearch && matchesPetType;
    });
    setPets(filteredPets);
  }, [searchTerm, selectedPetType, petsData.data]);

  const petTypes = Array.from(new Set(petsData.data.map((pet) => pet.petType)));

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-black mb-8"
        >
          Meet Our Furry Friends
        </motion.h1>
        <Separator className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-4 mb-6"
        >
          <div className="relative w-full max-w-xl">
            <Input
              type="text"
              placeholder="Search by name, type, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-full border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute h-5 w-5 right-3 top-2.5 text-indigo-400" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#00b2d8] hover:bg-[#2cc4e6] text-white rounded-full">
                <Filter className="mr-2 h-4 w-4" /> Filter by Pet Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSelectedPetType(null)}>
                All Pet Types
              </DropdownMenuItem>
              {petTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onSelect={() => setSelectedPetType(type)}
                  className="capitalize"
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {pets.length > 0 ? (
            pets.map((pet: CafePet) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white p-6">
                  <CardContent className="p-0">
                    <div className="flex gap-6">
                      {/* Left side - Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="h-24 w-24 rounded-full overflow-hidden">
                          <Image
                            src={pet.imageUrl || "/placeholder-pet.jpg"}
                            alt={pet.name}
                            layout="fill"
                            className="rounded-full"
                            objectFit="cover"
                          />
                        </div>
                      </div>

                      {/* Right side - Basic Info */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-2xl font-bold">{pet.name}</h2>
                          <Badge className="bg-[#00b2d8] hover:bg-[#2cc4e6]">
                            <p className="capitalize">{pet.sex}</p>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <PawPrint className="h-4 w-4" />
                          <span className="capitalize">
                            {pet.petType} - {pet.breed}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Cake className="h-4 w-4" />
                          <span>
                            {pet.year} years {pet.month} months
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Full width sections */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{pet.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Home className="h-4 w-4" />
                        <span>
                          Room: {pet.room.name} ({pet.room.roomNo})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-full text-center text-xl text-gray-500 mt-8"
            >
              No pets found. Try adjusting your search or filters.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
