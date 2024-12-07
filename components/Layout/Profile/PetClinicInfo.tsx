"use client";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { updatePetClinicByID } from "@/pages/api/api";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Stethoscope,
  Globe,
  Building,
  Clock,
  Edit,
} from "lucide-react";
import { Clinic } from "@/types/api";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function PetClinicInfo({ petClinic }: { petClinic: Clinic }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(petClinic.isActive);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updatePetClinicByID(petClinic.id, {
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
      }
    } finally {
      setLoading(false);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-50 min-h-screen">
      <Card className="mb-6 overflow-hidden">
        <div className="flex items-start">
          <CardHeader className="w-full flex flex-row gap-6">
            <motion.div
              className="relative md:w-1/2 h-80 aspect-square rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={petClinic.mainImage || `/default-clinic.png`}
                alt={`Room image ${petClinic.name}`}
                fill
                className="object-cover"
              />
            </motion.div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <CardTitle className="text-3xl font-bold">
                {petClinic.name}
              </CardTitle>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant={isActive ? "success" : "destructive"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created on{" "}
                  {format(new Date(petClinic.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="w-full md:w-1/6 flex items-center justify-between">
              <Switch
                checked={isActive}
                disabled={loading}
                onCheckedChange={handleStatusToggle}
              />
              <Button
                onClick={() =>
                  router.push(
                    `/admin/pet-clinic/pet-centers/${petClinic.id}/edit`
                  )
                }
                className="bg-black hover:bg-black"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
          </CardHeader>
        </div>
      </Card>

      <Tabs defaultValue="clinic-info">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinic-info">Clinic Information</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="clinic-info">
          <Card>
            <CardContent className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold flex items-center mb-2">
                    <Building className="mr-2" /> Description
                  </h3>
                  <p className="text-gray-600">{petClinic.description}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold flex items-center mb-2">
                    <Clock className="mr-2" /> Operating Hours
                  </h3>
                  <div className="flex flex-col ml-9">
                    {petClinic.operatingHours.map((hour, index) => (
                      <p key={index} className="text-gray-600">
                        {hour.dow}: {hour.startTime} - {hour.endTime}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-row">
                    <Phone className="mr-3" />
                    <p className="text-gray-600">{petClinic.contact}</p>
                  </div>
                </div>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold flex items-center mb-2">
                    <Stethoscope className="mr-2" /> Treatments
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {petClinic.treatment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold flex items-center mb-2">
                    {/* <Tool className="mr-2" /> */}
                    Tools
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {petClinic.tools.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Separator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          {petClinic.doctors?.length > 0 ? (
            petClinic.doctors?.map((doctor) => (
              <Card
                key={doctor.id}
                onClick={() => {
                  router.push(`/admin/doctors/${doctor.id}`);
                }}
                className="hover:cursor-pointer mb-6"
              >
                <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 mt-6">
                  <div className="w-1/5 flex justify-center items-center">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={doctor.profileUrl} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="w-4/5 space-y-4 flex-grow">
                    <div className="flex flex-row gap-3">
                      <h3 className="text-2xl font-semibold">{doctor.name}</h3>
                      <div className="flex items-center">
                        <Badge
                          variant={doctor.isActive ? "success" : "destructive"}
                        >
                          {doctor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 flex items-center">
                          <Mail className="mr-2" /> {doctor.email}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <Phone className="mr-2" /> {doctor.phoneNumber}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 flex items-center">
                          <Stethoscope className="mr-2" />{" "}
                          {doctor.specialties.join(", ")}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <Globe className="mr-2" />{" "}
                          {doctor.languages.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="p-4">No Doctors are assigned for this clinic.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
