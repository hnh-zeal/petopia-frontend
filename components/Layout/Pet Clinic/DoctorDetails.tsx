import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  GraduationCap,
  Languages,
  Phone,
  Mail,
  Stethoscope,
  Wrench,
  Star,
} from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/types/api";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { format, parse } from "date-fns";

const breadcrumbItems = (doctor: Doctor) => [
  { title: "Doctors", link: "/pet-clinics/doctors" },
  { title: `${doctor.name}`, link: `/pet-clinics/doctors/${doctor.id}` },
];

export interface DoctorDetailsProps {
  doctor: Doctor;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  const router = useRouter();
  const daysOrder = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const sortedSchedules = [...doctor.schedules].sort(
    (a, b) => daysOrder.indexOf(a.dow) - daysOrder.indexOf(b.dow)
  );

  return (
    <div className="mx-auto p-4 bg-gradient-to-br bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems(doctor)} />
        </div>
        <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-xl">
          <CardHeader className="bg-[#00b2d8] text-white p-6">
            <div className="flex items-center space-x-6">
              <div className="w-full md:w-1/5 flex flex-row justify-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-indigo-200">
                  <Image
                    src={doctor.profileUrl || "/default-doctor.png"}
                    alt={doctor.name}
                    layout="fill"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <CardTitle className="text-3xl font-bold">
                  {doctor.name}
                </CardTitle>
                <p className="text-indigo-200">{doctor.clinic.name}</p>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{doctor.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{doctor.email}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="clinic">Clinic</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="flex flex-col gap-4 mt-6">
                <div className="px-4">
                  <h3 className="text-xl font-semibold mb-4">
                    About Dr. {doctor.name}
                  </h3>
                  <p className="text-gray-700 mb-4">{doctor.about}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Star className="w-5 h-5 mr-2 text-indigo-600" />
                        Specialties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialties?.map((specialty: string, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty.trim()}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Languages className="w-5 h-5 mr-2 text-indigo-600" />
                        Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages?.map((language, index) => (
                          <Badge key={index} variant="outline">
                            {language.trim()}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <GraduationCap className="w-6 h-6 mr-2 text-indigo-600" />
                      Education
                    </h3>
                    {doctor.education?.map((edu, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <p className="font-semibold">{edu.name}</p>
                          <p className="text-sm text-gray-600">
                            {edu.location}
                          </p>
                          <p className="text-sm text-gray-600">{edu.year}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Stethoscope className="w-6 h-6 mr-2 text-indigo-600" />
                      Work Experience
                    </h3>
                    {doctor.work_experiences?.map((exp, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <p className="font-semibold">{exp.position}</p>
                          <p className="text-sm text-gray-600">
                            {exp.location}
                          </p>
                          <p className="text-sm text-gray-600">
                            {exp.from_year} - {exp.to_year}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="clinic">
                <h3 className="text-xl font-semibold mb-4">
                  Clinic Information
                </h3>
                <p className="text-gray-700 mb-4">
                  {doctor.clinic.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-indigo-600" />
                        Treatments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside">
                        {doctor.clinic.treatment?.map((treatment, index) => (
                          <li key={index} className="text-gray-700">
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Wrench className="w-5 h-5 mr-2 text-indigo-600" />
                        Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside">
                        {doctor.clinic?.tools?.map((tool, index) => (
                          <li key={index} className="text-gray-700">
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
                  Weekly Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sortedSchedules?.map((schedule, index) => {
                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <p className="font-semibold">
                            {daysOrder[Number(schedule.dayOfWeek)]}
                          </p>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {`${format(
                              parse(schedule.startTime, "HH:mm:ss", new Date()),
                              "h:mm a"
                            )} - ${format(
                              parse(schedule.endTime, "HH:mm:ss", new Date()),
                              "h:mm a"
                            )}`}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6] text-white"
              onClick={() => router.push(`/pet-clinics/appointments`)}
            >
              Book an Appointment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetails;
