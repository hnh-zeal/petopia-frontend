import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Package, Tag, Users, Edit, Camera } from "lucide-react";
import { CareService } from "@/types/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { updateCareService } from "@/pages/api/api";
import { toast } from "@/components/ui/use-toast";

const ServiceInfo: React.FC<{ service: CareService }> = ({ service }) => {
  const router = useRouter();
  const [active, setActive] = useState(service.isActive);

  const [loading, setLoading] = useState(false);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateCareService(service.id, {
        isActive: !active,
      });
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: `${data.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
    setActive(!active);
  };

  return (
    <ScrollArea className="h-[calc(100vh-140px)]">
      <div className="container mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-50 min-h-screen flex flex-col gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2" />
              Photo Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[service.mainImage, ...service.images].map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={image || `/default-pet-cafe.png`}
                    alt={`Room image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-purple-500">
                      Main Image
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6 overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex flex-row gap-5 items-center">
                  <CardTitle className="text-3xl font-bold">
                    {service.name}
                  </CardTitle>
                  <div>
                    <Badge variant={active ? "success" : "destructive"}>
                      {active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Type: {service.type}
                </p>
              </div>
              <div className="flex flex-row gap-4 items-center justify-between">
                <Switch
                  checked={active}
                  disabled={loading}
                  onCheckedChange={handleStatusToggle}
                />
                <Button
                  onClick={() =>
                    router.push(`/admin/pet-care/services/${service.id}/edit`)
                  }
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl font-bold">฿ {service.price}</span>
              </div>
              {service.rating && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-1 text-yellow-400" />
                  <span className="text-lg">{service.rating}</span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2 gap-2 flex items-center">
                <Package className="w-5 h-5 mr-2" /> Add-ons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.addOns.map((addon) => (
                  <Card key={addon.id}>
                    <CardContent className="p-4 flex flex-row justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{addon.name}</h4>
                        <p className="text-sm text-gray-500">
                          {addon.description || "No description available"}
                        </p>
                      </div>
                      <p className="text-green-600 font-semibold">
                        ${addon.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold mb-2 flex gap-2 items-center">
                <Tag className="w-5 h-5 mr-2" /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2 gap-2 flex items-center">
                <Users className="w-5 h-5 mr-2" /> Pet Sitters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.petSitters?.map((sitter) => (
                  <Card key={sitter.id}>
                    <CardContent className="p-4 flex items-start space-x-4">
                      <div className="w-1/5 justify-center flex items-center">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                          <Image
                            src={sitter.profileUrl || "/default-pet-sitter.png"}
                            alt={sitter.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                      </div>

                      <div className="w-4/5">
                        <h4 className="font-semibold">{sitter.name}</h4>
                        <p className="text-sm text-gray-500">{sitter.email}</p>
                        <p className="text-sm text-gray-500">
                          {sitter.phoneNumber}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs font-semibold">Specialties:</p>
                          <p className="text-xs text-gray-600">
                            {sitter.specialties.join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div className="text-sm text-gray-500">
              <p>
                Created:{" "}
                {format(new Date(service.createdAt), "MMMM d, yyyy HH:mm:ss")}
              </p>
              <p>
                Last Updated:{" "}
                {format(new Date(service.updatedAt), "MMMM d, yyyy HH:mm:ss")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ServiceInfo;
