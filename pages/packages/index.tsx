import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Packages } from "@/types/api";

const packages: Packages[] = [
  {
    id: 1,
    name: "Pet Clinic",
    description: "Regular check-ups and vaccinations for your furry friend",
    price: 99.99,
    duration: 1,
    durationType: "year",
    discountPercent: 10,
  },
  {
    id: 2,
    name: "Pet Care",
    description: "Daily care and grooming services for your pet",
    price: 49.99,
    duration: 1,
    durationType: "month",
    discountPercent: 5,
  },
  {
    id: 3,
    name: "Pet Cafe",
    description: "Access to our pet-friendly cafe and social events",
    price: 19.99,
    duration: 1,
    durationType: "week",
    discountPercent: 0,
  },
];

export default function PackagesPage() {
  const getDurationText = (duration: number, type: string) => {
    return `${duration} ${type}${duration > 1 ? "s" : ""}`;
  };

  const getDiscountedPrice = (price: number, discountPercent: number) => {
    return price - (price * discountPercent) / 100;
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose Your Pet Package
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-4">
                ${getDiscountedPrice(pkg.price, pkg.discountPercent).toFixed(2)}
                {pkg.discountPercent > 0 && (
                  <span className="text-lg line-through text-muted-foreground ml-2">
                    ${pkg.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <p>
                  Duration: {getDurationText(pkg.duration, pkg.durationType)}
                </p>
                {pkg.discountPercent > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {pkg.discountPercent}% off
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
