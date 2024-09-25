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
import { GetServerSideProps } from "next";
import { fetchPackages } from "../api/api";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<{
  packages: Packages;
}> = async (context) => {
  try {
    const packagesData = await fetchPackages({});
    return { props: { packages: packagesData.packages } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

export const getDurationText = (duration: number, type: string) => {
  return `${duration} ${type}${duration > 1 ? "s" : ""}`;
};

export const getDiscountedPrice = (price: number, discountPercent: number) => {
  return price - (price * discountPercent) / 100;
};

export default function PackagesPage({ packages }: { packages: Packages[] }) {
  const router = useRouter();

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
                {/* ฿
                      {getDiscountedPrice(
                        pkg.price,
                        pkg.discountPercent
                      ).toFixed(2)}
                      {pkg.discountPercent > 0 && (
                        <span className="text-lg line-through text-muted-foreground ml-2">
                          ฿ {pkg.price.toFixed(2)}
                        </span>
                      )} */}
                ฿ {pkg.price}
              </div>
              <div className="space-y-2">
                <p>
                  Duration: {getDurationText(pkg.duration, pkg.durationType)}
                </p>
                {pkg.discountPercent > 0 && (
                  <>
                    Discount Percent:{" "}
                    <Badge variant="secondary" className="text-sm">
                      {Number(pkg.discountPercent)} % off
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/packages/${pkg.id}`)}
                className="w-full"
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
