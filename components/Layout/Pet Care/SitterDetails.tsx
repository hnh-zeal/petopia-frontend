import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, Languages, Scissors, Star } from "lucide-react";
import Image from "next/image";
import { PetSitter } from "@/types/api";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { truncate } from "@/utils/truncate";

const breadcrumbItems = (sitter: PetSitter) => [
  { title: "Pet Sitters", link: "/pet-care/pet-sitters" },
  { title: `${sitter.name}`, link: `/pet-care/pet-sitters/${sitter.id}` },
];

interface PetSitterProps {
  sitter: PetSitter;
}

const PetSitterDetails: React.FC<PetSitterProps> = ({ sitter }) => {
  return (
    <div className="mx-auto p-4 bg-gradient-to-br bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems(sitter)} />
        </div>
        <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-xl">
          <CardHeader className="bg-[#00b2d8] text-white p-6">
            <div className="flex items-center space-x-6">
              <div className="w-full md:w-1/5 flex flex-row justify-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-white border-4 border-indigo-200">
                  <Image
                    src={sitter.profileUrl || "/default-pet-sitter.png"}
                    alt={sitter.name}
                    fill
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <CardTitle className="text-3xl font-bold">
                  {sitter.name}
                </CardTitle>
                <p>Professional Pet Sitter</p>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{sitter.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>{sitter.email}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="flex flex-col gap-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    About {sitter.name}
                  </h3>
                  <p className="text-gray-700 mb-4">{sitter.about}</p>
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
                          {sitter.specialties?.map(
                            (specialty: string, index) => (
                              <Badge key={index} variant="secondary">
                                {specialty.trim()}
                              </Badge>
                            )
                          )}
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
                          {sitter.languages?.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language.trim()}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h3>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 mr-3 text-indigo-600" />
                          <span>{sitter.phoneNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 mr-3 text-indigo-600" />
                          <span>{sitter.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="services" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
                <div className="space-y-6">
                  {sitter.services?.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-3/7">
                          <div className="relative w-80 h-80 overflow-hidden">
                            <Image
                              src={service.mainImage || "/default-doctor.png"}
                              alt={sitter.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="p-6 md:w-4/7">
                          <h4 className="text-lg font-semibold mb-2">
                            {service.name}
                          </h4>
                          <p className="text-gray-600 mb-4">
                            {truncate(service.description, 100)}
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <Badge variant="secondary">{service.type}</Badge>
                            <span className="text-lg font-bold text-indigo-600">
                              ${service.price}
                            </span>
                          </div>
                          <Separator className="my-4" />
                          <h5 className="font-semibold mb-2">Add-ons:</h5>
                          <ul className="space-y-2">
                            {service.addOns?.map((addon) => (
                              <li
                                key={addon.id}
                                className="flex justify-between items-center"
                              >
                                <span>{addon.name}</span>
                                <span className="font-semibold">
                                  ${addon.price}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetSitterDetails;
