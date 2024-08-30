import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";

import { useRouter } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function PetClinics({ clinicData }: any) {
  const router = useRouter();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Centers and Clinics</h1>
        <Separator />
        <div className="flex gap-4 my-6">
          <Input
            type="text"
            placeholder="Search by center name"
            className="max-w-sm"
          />
          <Button>Filter</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicData.clinics.map((clinic, index) => (
            <Card key={index}>
              <CardHeader>
                <Image
                  src={clinic.image}
                  alt={clinic.name}
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{clinic.name}</CardTitle>
              </CardContent>
              <CardFooter>
                <Button variant="link">See More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
