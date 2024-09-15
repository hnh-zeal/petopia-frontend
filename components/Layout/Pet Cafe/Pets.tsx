import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CafePet } from "@/types/api";
import { CalendarIcon, ChevronDown, Info, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Pets({ petsData }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pets, setPets] = useState(petsData.cafePets || []);

  useEffect(() => {
    const filteredPets = petsData.cafePets.filter((doctor: any) => {
      return (
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        doctor.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
      );
    });
    setPets(filteredPets);
  }, [searchTerm, petsData.cafePets]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pets in our cafe</h1>
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
        {pets.length > 0 ? (
          pets.map((pet: CafePet) => (
            <Card key={pet.id} className="overflow-hidden">
              {pet.imageUrl && (
                <div className="relative h-56 w-full">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{pet.name}</div>
                  <p className=" text-base">Pet Type & Breed: {pet.petType}</p>
                  <p className="text-base">Age: {pet.age} years old</p>
                  <p className="text-base">Sex: {pet.sex}</p>
                  <p className="text-base">Description: {pet?.description}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No Results.</p>
        )}
      </div>
    </div>
  );
}
