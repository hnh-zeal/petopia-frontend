"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/router";
import { format } from "date-fns";
import DoctorSchedule from "./DoctorSchedule";
import { AvailableSlotsClient } from "@/components/Tables/doctor-slots-tables/client";
import { ClinicAppointmentClient } from "@/components/Tables/clinic-appointment-tables/client";
import { toast } from "@/components/ui/use-toast";
import { updateDoctorByID } from "@/pages/api/api";

export default function DoctorInfo({ doctor }: any) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(doctor.isActive);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateDoctorByID(doctor.id, {
        isActive: !doctor.isActive,
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
    <>
      <div className="flex items-start justify-between">
        <Heading title="Doctor Profile" />
        <div className="flex items-center gap-10">
          <Switch
            checked={isActive}
            disabled={loading}
            onCheckedChange={handleStatusToggle}
          />
          <Button
            onClick={() => router.push(`/admin/doctors/${doctor.id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>
      <Separator />
      {/* Scrollable Content Area */}

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

        <ScrollArea className="h-[calc(100vh-220px)] pr-4">
          {/* Personal Information Tab */}
          <TabsContent value="personal-info">
            <Card className="my-5">
              <CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 place-items-center items-center gap-6">
                  {/* Profile Information */}
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold">{doctor.name}</h2>
                    <p className="text-gray-600">
                      Email:{" "}
                      <span className="text-gray-800">{doctor.email}</span>
                    </p>
                    <p className="text-gray-600">Phone: {doctor.phoneNumber}</p>
                    <p className="text-gray-600">
                      Clinic: {doctor.clinic?.name || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      Created At:{" "}
                      {format(
                        new Date(doctor.createdAt),
                        "dd MMM yyyy, HH:mm a"
                      )}
                    </p>
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center md:justify-end">
                    <Avatar className="h-44 w-44">
                      <AvatarImage
                        src={doctor.profileUrl}
                        alt="Profile Picture"
                      />
                      <AvatarFallback>Profile</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="p-2 my-6">
              <CardContent>
                {/* About Section */}
                <div className="flex flex-col gap-5 my-4">
                  <h3 className="text-lg font-bold">About</h3>
                  <p className="text-gray-600">{doctor.about || "N/A"}</p>
                </div>
                <Separator />

                {/* Specialties Section */}
                <div className="flex flex-row gap-10 my-4">
                  <h3 className="text-lg font-bold">Specialties</h3>
                  <p className="text-gray-600">
                    {doctor.specialties?.length > 0
                      ? doctor.specialties.join(", ")
                      : "N/A"}
                  </p>
                </div>
                <Separator />

                {/* Languages Section */}
                <div className="flex flex-row gap-10 my-4">
                  <h3 className="text-lg font-bold">Languages</h3>
                  <p className="text-gray-600">
                    {doctor.languages?.length > 0
                      ? doctor.languages.join(", ")
                      : "N/A"}
                  </p>
                </div>
                <Separator />

                {/* Work Experience Section */}
                <div className="flex flex-col gap-5 my-4">
                  <h3 className="text-lg font-bold">Work Experience</h3>
                  {doctor.work_experiences?.length > 0 ? (
                    <ul className="list-disc ml-5 text-gray-600">
                      {doctor.work_experiences.map(
                        (exp: any, index: number) => (
                          <li key={index}>
                            From {exp.from_year} To {exp.to_year}:{" "}
                            {exp.position} at {exp.location}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
                </div>
                <Separator />

                {/* Education Section */}
                <div className="flex flex-col gap-5 my-4">
                  <h3 className="text-lg font-bold">Education</h3>
                  {doctor.education?.length > 0 ? (
                    <ul className="list-disc ml-5 text-gray-600">
                      {doctor.education.map((edu: any, index: number) => (
                        <li key={index}>
                          {edu.year ? `Year: ${edu.year} | ` : ""}
                          Name: {edu.name} | Location: {edu.location}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">N/A</p>
                  )}
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
        </ScrollArea>
      </Tabs>
    </>
  );
}
