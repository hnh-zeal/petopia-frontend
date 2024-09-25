import { FaPaw, FaSyringe, FaBone, FaHeartbeat } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PetCareServices() {
  return (
    <section className="container mx-auto p-10 px-12 grid lg:grid-cols-2 gap-10 items-center">
      {/* Left Section: Heading and Button */}
      <div className="flex flex-col space-y-10">
        <h3 className="inline text-4xl md:text-5xl font-bold leading-tight">
          Optimal Health for Furry Friends: <br />
          Comprehensive Veterinary Services
        </h3>
        <Link href="/pet-care">
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="text-white rounded-3xl w-1/4">View more</Button>
          </div>
        </Link>
      </div>

      {/* Right Section: Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Service Card 1 */}
        <div className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <FaPaw className="text-blue-600 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Physical Exam</h3>
          <p className="text-gray-600 mt-2">
            Excepteur culpa velit non desedder
          </p>
          <Link href="/pet-care" className="mt-4 inline-block ">
            <Button variant="ghost">View more</Button>
          </Link>
        </div>

        {/* Service Card 2 */}
        <div className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <FaHeartbeat className="text-blue-600 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Skin Care</h3>
          <p className="text-gray-600 mt-2">
            Consectetur incididunt esse in eiusmod
          </p>
          <Link href="/pet-care" className="mt-4 inline-block ">
            <Button variant="ghost">View more</Button>
          </Link>
        </div>

        {/* Service Card 3 */}
        <div className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <FaSyringe className="text-blue-600 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Pet Vaccination</h3>
          <p className="text-gray-600 mt-2">
            Excepteur elit aliqua nostrud nulla
          </p>
          <Link href="/pet-care" className="mt-4 inline-block ">
            <Button variant="ghost">View more</Button>
          </Link>
        </div>

        {/* Service Card 4 */}
        <div className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <FaBone className="text-blue-600 text-3xl mb-4" />
          <h3 className="text-xl font-semibold">Pet Nutrition</h3>
          <p className="text-gray-600 mt-2">
            Velit tempor duis enim elit cillum adipiscing
          </p>
          <Link href="/pet-care" className="mt-4 inline-block ">
            <Button variant="ghost">View more</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
