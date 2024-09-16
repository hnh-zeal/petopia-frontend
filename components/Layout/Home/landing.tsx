import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function Landing() {
  return (
    <section className="container flex flex-col lg:flex-row items-start lg:items-center py-10 px-20 gap-8 lg:gap-16">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Petopia
            <br />
            Purrfect Care
          </h1>
        </main>
        <p className="text-gray-600 mb-6 max-w-md">
          We provide quality pet care and personalized treatment plans for your
          pet
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-2/5 rounded-3xl">
            Make an appointment
          </Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="md:flex-1 relative">
        {/* Dog image */}
        <div className="flex flex-row justify-around items-center">
          <Image
            src="/cattt.png"
            alt="Curious cat"
            width={150}
            height={150}
            className="self-center object-cover items-center z-20"
          />
          <Image
            src="/doggg.png"
            alt="Happy dog"
            width={380}
            height={380}
            className="self-end object-cover z-20"
          />
        </div>
        {/* Decorative circles */}
        <div className="absolute h-8 w-8 left-[20%] top-[30%] bg-yellow-400 rounded-full"></div>
        <div className="absolute w-8 h-8 left-[35%] top-[18%]  bg-blue-700 rounded-full"></div>
        <div className="absolute w-8 h-8 right-[25%] top-[1%] bg-orange-400 rounded-full"></div>
        <div className="absolute w-32 h-32 left-[8%] top-[43%] bg-red-400 rounded-full"></div>
        <div className="absolute h-96 w-96 left-[40%] top-[15%] bg-teal-200 rounded-full"></div>
      </div>

      {/* <div className="md:w-1/2 relative">
        <Image
          src="/cat-landing.png"
          alt="Cat"
          width={128}
          height={128}
          className="absolute right-[58%] top-[80%] z-20 rounded "
        />
        <div className="absolute w-4 h-4 right-[40%] top-1/3 bg-yellow-400 rounded-full"></div>
        <div className="absolute w-36 h-36 right-[58%] top-[80%] bg-red-400 rounded-full"></div>

        <Image
          src="/dog-landing.png"
          alt="Small dog"
          width={80}
          height={80}
          className="absolute right-[50%] bottom-[20%] z-20 rounded-full object-cover"
        />
        <div className="absolute w-20 h-20 right-[50%] bottom-[20%] bg-blue-700 rounded-full"></div>

        <Image
          src="/landing.png"
          alt="Large dog"
          width={200}
          height={200}
          className="absolute right-[58%] top-[80%] z-20 rounded"
        />
        <div className="absolute w-80 h-80 bottom-[20%] bg-teal-400 rounded-full"></div>
      </div> */}

      {/* <div className="md:w-1/2 relative h-96">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-400 rounded-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=320&width=320"
            alt="Dog"
            width={200}
            height={200}
            className="object-cover"
          />
        </div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-coral-400 rounded-full overflow-hidden">
          <Image
            src="/cat-landing.png"
            alt="Cat and Dog"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
        <div className="absolute left-1/4 top-1/4 w-20 h-20 bg-yellow-400 rounded-full overflow-hidden">
          <Image
            src="/dog-landing.png"
            alt="Small dog"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <div className="absolute right-1/4 bottom-1/4 w-4 h-4 bg-yellow-400 rounded-full"></div>
      </div> */}
    </section>
  );
}
