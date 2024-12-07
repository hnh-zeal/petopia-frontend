import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

const featureList = [
  {
    title: "Well-trained Staff",
    description:
      "Our staffs are fully trained in canine and feline first-aid and CPR",
    icon: "👨‍🎓",
  },
  {
    title: "Specially Toy Clean",
    description:
      "We use only the safest cleaning products formulated specifically for use around animals",
    icon: "🧼",
  },
  {
    title: "Monitor your Pets",
    description: "Access our live webcam on your phones and laptops",
    icon: "📹",
  },
  {
    title: "Safe Environment",
    description: "All boarding pets are healthy, spayed, neutered & vaccinated",
    icon: "🏠",
  },
];

export default function AboutUs() {
  return (
    <div className="w-full flex flex-col gap-10 py-12">
      {/* Our Story */}
      <section className="container flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">Our Story</h1>
          <p className="text-gray-600">
            Since 2019, we&apos;ve revolutionized pet care by setting new
            industry standards. With a nationwide presence, we provide
            exceptional care for your beloved pets in various tailored
            environments.
          </p>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Values
            </h2>
            <ul className="space-y-3">
              {[
                "Always be transparent",
                "Work compassionately",
                "Take pride in our community",
                "Be curious",
              ].map((value, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="flex flex-row gap-5 w-full h-[400px] justify-around">
            <Image
              src="/happyDog.png"
              alt="Happy dog"
              width={200}
              height={100}
              className="rounded-full self-end object-cover left-0 z-10 h-3/4"
            />
            <Image
              src="/curiousCat.png"
              alt="Curious cat"
              width={200}
              height={300}
              className="rounded-full object-cover right-36 bottom-0 z-20"
            />
          </div>
          <div className="absolute top-[100px] left-[50%] z-10 w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="absolute top-14 left-[30%] z-10 w-8 h-8 bg-teal-400 rounded-full"></div>
          <div className="absolute bottom-16 left-[45%] z-10 w-8 h-8 bg-yellow-400 rounded-full"></div>
        </div>
      </section>

      {/* Founder Words */}
      <section className="bg-gray-100 py-10">
        <div className="container flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <Image
              src="/dog-hug.webp"
              alt="Woman with pets"
              width={500}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex-1 space-y-10">
            <h2 className="text-3xl font-bold mb-4">
              We Are Providing Pet Care Service For{" "}
              <span className="text-purple-600">Years</span>
            </h2>
            <p className="text-gray-700 mb-4">
              &quot;At Happy Pet Care, our goal is to make caring for a pet that
              much easier, by providing a flexible and reliable service, so pet
              owners can go about their business, and not have to worry about
              their pet waiting for them at home.&quot;
            </p>
            <p className="font-semibold">
              Founder, Happy Pet Care
              <br />
              Mary Snow
            </p>
          </div>
        </div>
      </section>

      {/* Your Pet is safe with us */}
      <section className="container mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Your Pet is Safe with us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feature: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-3xl">{feature.icon}</span>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews */}
      {/* <section className="bg-gray-100 py-10">
        <div className="container">
          <h2 className=" text-2xl font-bold mb-6 text-center">
            Customer Reviews
          </h2>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src="/placeholder.svg?height=64&width=64"
                  alt="Customer"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Customer Name</h3>
                <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                <p className="text-muted-foreground mt-2">
                  I had a great experience with this pet care service! They took
                  excellent care of my dog and I felt completely at ease leaving
                  him in their capable hands.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}
    </div>
  );
}
