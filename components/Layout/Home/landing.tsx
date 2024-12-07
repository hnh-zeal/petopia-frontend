import { Button } from "@/components/ui/button";
import { userAuthState } from "@/states/auth";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Landing() {
  const auth = useRecoilValue(userAuthState);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Button
            onClick={() => router.push(`/pet-clinics`)}
            className="w-full md:w-2/5 rounded-3xl bg-[#00b2d8] hover:bg-[#2cc4e6]"
          >
            Make an appointment
          </Button>
          {mounted && auth && (
            <Button
              className="w-full md:w-2/5 rounded-3xl bg-[#00b2d8] hover:bg-[#2cc4e6]"
              onClick={() => {
                router.push("/profile/appointments");
              }}
            >
              My Appointments ➔
            </Button>
          )}
        </div>
      </div>

      {/* Hero cards section */}
      <div className="md:flex-1 relative">
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
    </section>
  );
}
