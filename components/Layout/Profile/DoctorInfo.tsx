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
import DoctorSchedule from "./DoctorSchedule";
import { AvailableSlotsClient } from "@/components/Tables/doctor-slots-tables/client";
import { ClinicAppointmentClient } from "@/components/Tables/clinic-appointment-tables/client";
import { toast } from "@/components/ui/use-toast";
import { fetchDoctorByID, updateDoctorByID } from "@/pages/api/api";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  Globe,
  Briefcase,
  GraduationCap,
  Building,
} from "lucide-react";
import { Doctor } from "@/types/api";

export default function DoctorInfo({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [doctorData, setDoctorData] = useState(doctor);
  const [isActive, setIsActive] = useState(doctor.isActive);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateDoctorByID(doctor.id, {
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
        const doctorData = await fetchDoctorByID(doctor.id);
        setDoctorData(doctorData);
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
                  src={doctor.profileUrl || "/default-doctor.png"}
                  alt={doctor.name}
                />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full md:w-5/6">
              <h1 className="text-3xl font-bold">{doctorData.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge
                  variant={doctorData.isActive ? "success" : "destructive"}
                >
                  {doctorData.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {format(new Date(doctorData.createdAt), "MMMM d, yyyy")}
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
                  router.push(`/admin/doctors/${doctorData.id}/edit`)
                }
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="personal-info">
          <TabsList className="border-b space-x-10">
            <TabsTrigger value="personal-info" className="p-2">
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="schedule" className="p-2">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="slots" className="p-2">
              Available Slots
            </TabsTrigger>
            <TabsTrigger value="appointments" className="p-2">
              Clinic Appointments
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
                      {doctorData.about || "..."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center">
                      Contact Information
                    </h3>
                    <p className="text-gray-600 text-pretty flex items-center">
                      <Mail className="mr-2" /> {doctorData.email}
                    </p>
                    <p className="text-gray-600 text-pretty flex items-center">
                      <Phone className="mr-2" /> {doctorData.phoneNumber}
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
                      {doctorData.specialties?.length > 0 ? (
                        doctorData.specialties.map(
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
                      {doctorData.languages?.length > 0 ? (
                        doctorData.languages.map(
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center justify-start">
                      <Briefcase className="mr-2" /> Work Experience
                    </h3>
                    {doctorData.work_experiences?.length > 0 ? (
                      <ul className="list-disc ml-5 text-gray-600">
                        {doctorData.work_experiences.map(
                          (exp: any, index: number) => (
                            <li key={index}>
                              {exp.from_year} - {exp.to_year}: {exp.position} at{" "}
                              {exp.location}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold flex items-center">
                      <GraduationCap className="mr-2" /> Education
                    </h3>
                    {doctor.education?.length > 0 ? (
                      <ul className="list-disc ml-5 text-gray-600">
                        {doctor.education.map((edu: any, index: number) => (
                          <li key={index}>
                            {edu.year}: {edu.name} at {edu.location}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                </div>
                <Separator />

                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold flex items-center">
                    <Building className="mr-2" /> Clinic Information
                  </h3>
                  <p className="text-gray-600">
                    Clinic Name: {doctor.clinic.name}
                  </p>
                  <p className="text-gray-600">
                    Description: {doctor.clinic.description}
                  </p>
                  <p className="text-gray-600">
                    Contact: {doctor.clinic.contact}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="my-5">
              <CardContent>
                <DoctorSchedule schedules={doctor.schedules} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Slots Tab */}
          <TabsContent value="slots">
            <div className="py-2 my-4">
              <AvailableSlotsClient doctor={doctor} />
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="p-6 my-4">
              <ClinicAppointmentClient isAdmin={true} doctor={doctor} />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
