import React, { useState } from "react";
import {
  Card,
  CardFooter,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Pagination from "../Tables/pagination";
import { Separator } from "@/components/ui/separator";
import { Heading } from "../ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";
import { Packages, PackagesData } from "@/types/api";
import { Badge } from "../ui/badge";

export default function PackagesCards({
  packagesData,
}: {
  packagesData: PackagesData;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  const getDurationText = (duration: number, type: string) => {
    return `${duration} ${type}${duration > 1 ? "s" : ""}`;
  };

  const getDiscountedPrice = (price: number, discountPercent: number) => {
    return price - (price * discountPercent) / 100;
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Packages" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/packages/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] rounded-md px-3">
        <div className="container mx-auto p-4">
          {packagesData?.packages.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packagesData?.packages.map((pkg: Packages) => (
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
                        Duration:{" "}
                        {getDurationText(pkg.duration, pkg.durationType)}
                      </p>
                      {pkg.discountPercent > 0 && (
                        <>
                          Discount Percent:{" "}
                          <Badge variant="secondary" className="text-sm">
                            {pkg.discountPercent}% off
                          </Badge>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row justify-end">
                    <Button>Edit</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Pagination
                currentPage={currentPage}
                totalPages={packagesData?.totalPages || 0}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
