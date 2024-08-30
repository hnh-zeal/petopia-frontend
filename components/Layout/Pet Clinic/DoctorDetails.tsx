import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  Syringe,
  Users,
  Package,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Doctor } from "@/types/api";

export default function ClinicDetails({ clinic }: any) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-3xl font-bold">{clinic.name}</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
          <Image
            src="/PetClinic/cardiology.jpg?height=300&width=800"
            alt="Cardiology Clinic"
            width={800}
            height={300}
            className="w-full rounded-lg mb-6"
          />

          <section id="general-info" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              General Information
            </h2>
            <p className="text-gray-700">{clinic.description}</p>
          </section>

          <section id="diseases" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Heart disease diagnosis services
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Special external device examination, electrocardiogram,
                echocardiography, exercise cardioversion, 24-hour heart rate
                recording, and abnormal monitoring
              </li>
              <li>
                Invasive procedures are diagnostic procedures that involve
                inserting a catheter into the heart or blood vessels to diagnose
                heart disease
              </li>
            </ul>
            <div className="mt-4 space-x-4">
              <Button className="bg-pink-600 hover:bg-pink-700">
                Advanced Technology
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700">
                Invasive Diagnostic Service
              </Button>
            </div>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              For more information, please contact
            </h2>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-pink-600 mb-2">
                  {clinic.name}
                </h3>
                {clinic.operatingHours?.map((day: any, index: number) => (
                  <p key={index}>{day.dow} from 7:00 AM to 4:00 PM.</p>
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
          <div className="lg:sticky lg:top-20 space-y-4">
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
                      Diseases And Treatment
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
                      href="#packages"
                      className="flex items-center text-gray-600 hover:underline"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Packages And Promotions
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
            <Button className="w-full bg-blue-900 hover:bg-blue-800">
              Make an appointment
            </Button>
          </div>
        </div>
      </div>

      <section id="doctors" className="mt-12">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinic.doctors?.map((doctor: Doctor, index: number) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center space-x-4">
                <Image
                  src={doctor.profileUrl || ""}
                  alt={doctor.name}
                  width={150}
                  height={150}
                  className="rounded-full w-20 h-20 object-cover"
                />
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-pink-600">{doctor.specialties}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
