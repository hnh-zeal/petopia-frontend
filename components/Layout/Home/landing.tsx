import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function Landing() {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <p className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Petopia <br /> Purrfect Care
            </p>
          </h1>
        </main>
        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          We provide quality pet care and personalized treatment plans for pet
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-2/5 rounded-3xl">
            Make an appointment
          </Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="relative z-10 flex justify-center lg:justify-end items-center">
        <div className="relative z-30">
          <Image
            src="/Landing.png"
            width={456}
            height={593}
            alt="Dog"
            className="absolute left-0 top-1/3 rounded-full"
          />
        </div>
        <div className="absolute top-1/2 left-9 md:left-0 transform -translate-y-1/2 flex flex-col items-center space-y-4">
          <Image
            src="/dog-landing.png"
            width={104}
            height={135}
            alt="Small Dog"
            className="rounded-full shadow-lg"
          />
          <Image
            src="/cat-landing.png"
            width={104}
            height={135}
            alt="Cat"
            className="rounded-full shadow-lg"
          />
        </div>
        {/* Background circle */}
        <div className="absolute top-0 right-0 md:right-20 lg:right-32 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200 rounded-full"></div>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
}
