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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPackageByID } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { toast } from "../ui/use-toast";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { SelectItem } from "../ui/select";
import {
  discountPercents,
  durationType,
  packagesType,
} from "../Forms/create-packages-form";
import { Input } from "../ui/input";

const EditPackageSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  type: z.string().min(1, { message: "Type is required." }),
  duration: z.number(),
  durationType: z.string().min(1, { message: "Duration Type is required." }),
  price: z.number(),
  discountPercent: z
    .string()
    .min(1, { message: "Discount Percent is required." }),
});

type PackagesFormValue = z.infer<typeof EditPackageSchema>;

export default function PackagesCards({
  packagesData,
}: {
  packagesData: PackagesData;
}) {
  const router = useRouter();
  const auth = useRecoilValue(adminAuthState);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  const form = useForm<PackagesFormValue>({
    resolver: zodResolver(EditPackageSchema),
  });

  const onSubmit = async (formValues: PackagesFormValue) => {
    setLoading(true);
    try {
      const { id, ...formData } = formValues;
      const data = await editPackageByID(
        Number(id),
        formData,
        auth?.accessToken as string
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Package updated.",
        });
        window.location.reload();
        setDialogOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setDialogOpen(false);
    form.reset();
  };

  const onEdit = (pkg: Packages) => {
    form.setValue("id", pkg.id);
    form.setValue("name", pkg.name);
    form.setValue("description", pkg.description);
    form.setValue("type", pkg.type);
    form.setValue("duration", pkg.duration);
    form.setValue("durationType", pkg.durationType);
    form.setValue("price", Number(pkg.price));
    form.setValue("discountPercent", `${pkg.discountPercent}`);
    setDialogOpen(true);
  };

  const getDurationText = (duration: number, type: string) => {
    const pluralType = duration <= 1 ? type.slice(0, -1) : type;

    return `${duration} ${pluralType}`;
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
          {packagesData.packages?.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packagesData.packages?.map((pkg: Packages) => (
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
                            {pkg.discountPercent} % off
                          </Badge>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row justify-end">
                    <Button onClick={() => onEdit(pkg)}>Edit</Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5 px-2"
            >
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter package's name"
                  control={form.control}
                  name="name"
                  label="Name"
                  required={true}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="type"
                  label="Package Type"
                  placeholder="Select Type"
                  required={true}
                >
                  {packagesType.map((type, i) => (
                    <SelectItem key={i} value={`${type.value}`}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{type.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="shad-input-label">
                        Duration <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Duration"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          min={0}
                        />
                      </FormControl>
                      <FormMessage className="shad-error" />
                    </FormItem>
                  )}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  placeholder="Duration Type"
                  control={form.control}
                  name="durationType"
                  label="Duration Type"
                  required={true}
                >
                  {durationType.map((type, i: number) => (
                    <SelectItem key={i} value={`${type.value}`}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{type.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="shad-input-label">
                        Price <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          min={0}
                        />
                      </FormControl>
                      <FormMessage className="shad-error" />
                    </FormItem>
                  )}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  placeholder="Discount Percent"
                  control={form.control}
                  name="discountPercent"
                  label="Discount Percent"
                  required={true}
                >
                  {discountPercents.map((discount, i) => (
                    <SelectItem key={i} value={`${discount.value}`}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{discount.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Description"
                  control={form.control}
                  name="description"
                  label="Description"
                  required={true}
                />
              </div>

              <div className="flex mt-10 items-center justify-between space-x-4">
                <div></div>
                <div className="flex items-center justify-between space-x-4">
                  <DialogFooter>
                    <Button
                      disabled={loading}
                      variant="outline"
                      type="button"
                      className="ml-auto w-full"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
