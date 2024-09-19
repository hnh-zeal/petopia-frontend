import { Breadcrumbs } from "@/components/breadcrumbs";
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
import { Packages, PackagesData } from "@/types/api";
import { fetchPackages } from "@/pages/api/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Packages", link: "/admin/packages" },
];

export const getStaticProps = (async () => {
  const packagesData = await fetchPackages({});
  return { props: { packagesData } };
}) satisfies GetStaticProps<{
  packagesData: PackagesData;
}>;

export default function PackagesPage({
  packagesData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const packages = packagesData.packages;
  const getDurationText = (duration: number, type: string) => {
    return `${duration} ${type}${duration > 1 ? "s" : ""}`;
  };

  const getDiscountedPrice = (price: number, discountPercent: number) => {
    return price - (price * discountPercent) / 100;
  };

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold text-center mb-12">
                  Choose Your Pet Package
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {packages.map((pkg: Packages) => (
                    <Card key={pkg.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="text-3xl font-bold mb-4">
                          $
                          {getDiscountedPrice(
                            pkg.price,
                            pkg.discountPercent
                          ).toFixed(2)}
                          {pkg.discountPercent > 0 && (
                            <span className="text-lg line-through text-muted-foreground ml-2">
                              ${pkg.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p>
                            Duration:{" "}
                            {getDurationText(pkg.duration, pkg.durationType)}
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
            </ScrollArea>
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
