import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartPulse, Syringe, Users, MessageCircle, Info } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clinic, Doctor } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";

export default function ClinicDetails({ clinic }: { clinic: Clinic }) {
  const router = useRouter();

  const userAuth = useRecoilValue(userAuthState);

  return (
    <div className="container mx-auto px-4">
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-3xl font-bold">{clinic.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 space-x-4">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
          <section id="image" className="mb-8">
            <Image
              src={clinic.mainImage}
              alt="Cardiology Clinic"
              width={800}
              height={300}
              className="w-full rounded-lg mb-6"
            />
          </section>

          <section id="general-info" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              General Information
            </h2>
            <p className="text-gray-700">{clinic.description}</p>
          </section>

          <section id="treatments" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Treatments and Tools
            </h2>

            <div className="grid grid-cols-2">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {clinic.treatment?.map((treatment, index) => (
                  <li key={index}>{treatment}</li>
                ))}
              </ul>

              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                {clinic.tools?.map((tool, index) => (
                  <li key={index}>{tool}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="doctors" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-800">
                Related Doctors
              </h2>
              <Link
                href="/pet-clinics/doctors"
                className="text-pink-600 hover:underline"
              >
                SEE OTHER DOCTORS →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {clinic.doctors?.slice(0, 2).map((doctor: Doctor) => (
                <Card
                  key={doctor.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image
                          src={doctor.profileUrl || "/default-doctor.png"}
                          alt={doctor.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-semibold text-indigo-900">
                          {doctor.name}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {doctor.specialties?.map(
                            (specialty: string, index: number) => (
                              <Badge
                                key={index}
                                variant="default"
                                className="bg-indigo-100 text-indigo-800"
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
                        router.push(`/pet-clinics/doctors/${doctor.id}`)
                      }
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              For more information, please contact
            </h2>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-pink-600 mb-2">
                  Opening Hours
                </h3>
                {clinic.operatingHours?.map((day: any, index: number) => (
                  <p key={index}>{day.dow}: 7:00 AM - 4:00 PM.</p>
                ))}
                <div className="mt-4">
                  <p>
                    <span className="font-semibold">Tel:</span> {clinic.contact}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 xl:w-1/4 order-1 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#general-info"
                      className="flex items-center text-pink-600 hover:underline"
                    >
                      <HeartPulse className="mr-2 h-5 w-5" />
                      General Information
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#diseases"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <Syringe className="mr-2 h-5 w-5" />
                      Treatment and Tools
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#doctors"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Related Doctors
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#contact"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {userAuth === undefined ? (
              <Button
                className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6]"
                onClick={() => {
                  router.push("/register");
                }}
              >
                Register to make an appointment
              </Button>
            ) : (
              <Button
                className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6]"
                onClick={() => router.push("/pet-clinics/appointments")}
              >
                Make an appointment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
