"use client";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { CareAppointmentClient } from "@/components/Tables/care-appointment-tables/client";
import { toast } from "@/components/ui/use-toast";
import { fetchPetSitterByID, updatePetSitterByID } from "@/pages/api/api";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Stethoscope, Globe, Edit } from "lucide-react";
import { PetSitter } from "@/types/api";
import Image from "next/image";
import { truncate } from "@/utils/truncate";

export default function PetSitterInfo({ petSitter }: { petSitter: PetSitter }) {
  const router = useRouter();
  const [petSitterData, setPetSitterData] = useState(petSitter);
  const [isActive, setIsActive] = useState(petSitter.isActive);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updatePetSitterByID(petSitter.id, {
        isActive: !isActive,
      });
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: `${data.message}`,
        });
        const petSitterData = await fetchPetSitterByID(petSitter.id);
        setPetSitterData(petSitterData);
      }
    } finally {
      setLoading(false);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br  min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardContent className="flex items-center space-x-6 p-6">
            <div className="w-full md:w-1/6 flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={petSitter.profileUrl || "/default-petSitter.png"}
                  alt={petSitter.name}
                />
                <AvatarFallback>{petSitter.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full md:w-5/6">
              <h1 className="text-3xl font-bold">{petSitterData.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge
                  variant={petSitterData.isActive ? "success" : "destructive"}
                >
                  {petSitterData.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {format(new Date(petSitterData.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <Switch
                checked={isActive}
                disabled={loading}
                onCheckedChange={handleStatusToggle}
              />
              <Button
                onClick={() =>
                  router.push(`/admin/petSitters/${petSitterData.id}/edit`)
                }
              >
                <Edit className="mr-2 w-4 h-4" /> Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="personal-info">
          <TabsList className="border-b grid w-full grid-cols-3">
            <TabsTrigger value="personal-info" className="p-2">
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="services" className="p-2">
              Care Services
            </TabsTrigger>
            <TabsTrigger value="appointments" className="p-2">
              Care Appointments
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal-info">
            <Card className="p-2 my-6">
              <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center">
                      <User className="mr-2" /> About
                    </h3>
                    <p className="text-gray-600 text-pretty">
                      {petSitterData.about || "..."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center">
                      Contact Information
                    </h3>
                    <p className="text-gray-600 text-pretty flex items-center">
                      <Mail className="mr-2" /> {petSitterData.email}
                    </p>
                    <p className="text-gray-600 text-pretty flex items-center">
                      <Phone className="mr-2" /> {petSitterData.phoneNumber}
                    </p>
                  </div>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center">
                      <Stethoscope className="mr-2" /> Specialties
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {petSitterData.specialties?.length > 0 ? (
                        petSitterData.specialties.map(
                          (specialty: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 dark:bg-blue-200 dark:text-blue-800"
                            >
                              {specialty}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-gray-600">N/A</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center">
                      <Globe className="mr-2" /> Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {petSitterData.languages?.length > 0 ? (
                        petSitterData.languages.map(
                          (language: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 dark:bg-green-200 dark:text-green-800"
                            >
                              {language}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-gray-600">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
                <Separator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="my-6 px-2">
              <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
              <div className="space-y-6">
                {petSitter.services?.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="flex flex-row gap-4 justify-between items-center">
                      <div className="md:w-2/5">
                        <div className="relative w-full h-96 overflow-hidden">
                          <Image
                            src={service.mainImage || "/default-doctor.png"}
                            alt={petSitter.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="p-6 md:w-3/5">
                        <h4 className="text-lg font-semibold mb-2">
                          {service.name}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {truncate(service.description, 100)}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                          <Badge variant="secondary">{service.type}</Badge>
                          <span className="text-lg font-bold text-indigo-600">
                            ${service.price}
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <h5 className="font-semibold mb-2">Add-ons:</h5>
                        <ul className="space-y-2">
                          {service.addOns?.map((addon) => (
                            <li
                              key={addon.id}
                              className="flex justify-between items-center"
                            >
                              <span>{addon.name}</span>
                              <span className="font-semibold">
                                ${addon.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="my-6 px-2">
              <CareAppointmentClient isAdmin={true} petSitter={petSitter} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
