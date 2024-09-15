import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaClinicMedical, FaPaw, FaCoffee } from "react-icons/fa";

const PetServices = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="text-center container mx-auto">
        <h1 className="text-4xl font-bold">
          Compassionate care,{" "}
          <span className="text-purple-600">cutting-edge service.</span>
        </h1>
        <p className="mt-4 text-lg">
          Our Pet Clinic provides top-notch veterinary care, while our Pet Care
          and Pet Café services ensure your pet’s health and happiness.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 justify-around p-12">
        <div className="flex-1 space-y-6 md:space-y-8 p-6 rounded-lg shadow-lg bg-purple-100">
          <div className="flex flex-col space-y-8 justify-around">
            <div className="flex items-center">
              <FaClinicMedical className="w-8 h-8 mr-4 text-purple-500" />
              <h3 className="text-2xl font-semibold">Pet Clinic</h3>
            </div>
            <p>
              Ensure your pet’s health with our comprehensive veterinary
              services. From routine check-ups to advanced treatments, we’ve got
              you covered.
            </p>
            <Link href="/pet-clinics">
              <Button className="rounded-3xl text-white">Learn more ➔</Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 space-y-6 md:space-y-8 p-6 rounded-lg shadow-lg bg-red-100">
          <div className="flex flex-col space-y-8 justify-around">
            <div className="flex items-center">
              <FaPaw className="w-8 h-8 mr-4 text-red-500" />
              <h3 className="text-2xl font-semibold">Pet Care</h3>
            </div>
            <p>
              Keep your pet happy and healthy with our dedicated care services.
              We offer grooming, daycare, and personalized attention to make
              sure your pet feels loved and cared for.
            </p>
            <Link href="/pet-care">
              <Button className="rounded-3xl text-white">Learn more ➔</Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 space-y-6 md:space-y-8 p-6 rounded-lg shadow-lg bg-green-100">
          <div className="flex flex-col space-y-8 justify-around">
            <div className="flex items-center">
              <FaCoffee className="w-8 h-8 mr-4 text-green-500" />
              <h3 className="text-2xl font-semibold">Pet Café</h3>
            </div>
            <p className="text-pretty">
              Relax and enjoy a coffee while your pet socializes with others.
              Our pet-friendly café offers a cozy space for you and your furry
              friend.
            </p>
            <Link href="/pet-cafe/rooms">
              <Button className="rounded-3xl text-white">Learn more ➔</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetServices;
