import React, { useEffect, useState } from "react";
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
import { Edit, PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { ScrollArea } from "../ui/scroll-area";
import { Packages } from "@/types/api";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { editPackageByID, fetchPackages } from "@/pages/api/api";
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
import { useFetchData } from "@/hooks/useFetchData";
import Loading from "@/pages/loading";
import SubmitButton from "../submit-button";

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

export default function PackagesCards() {
  const router = useRouter();
  const adminAuth = useRecoilValue(adminAuthState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackages] = useState<Packages[]>([]);

  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<Packages>(fetchPackages, 1, 3, adminAuth?.accessToken);

  useEffect(() => {
    if (data) {
      setPackages(data);
    }
  }, [data]);

  const form = useForm<PackagesFormValue>({
    resolver: zodResolver(EditPackageSchema),
  });

  const onSubmit = async (formValues: PackagesFormValue) => {
    setIsLoading(true);
    try {
      const { id, ...formData } = formValues;
      const data = await editPackageByID(
        Number(id),
        formData,
        adminAuth?.accessToken as string
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

        setPackages((prevPackages) =>
          prevPackages.map((pkg) => (pkg.id === data.data.id ? data.data : pkg))
        );
        setDialogOpen(false);
      }
    } finally {
      setIsLoading(false);
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
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] rounded-md px-3">
        <div className="container mx-auto p-4">
          {packages?.length === 0 ? (
            <p>No Results Found</p>
          ) : (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-220px)]">
                  <Loading />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {packages?.map((pkg: Packages) => (
                    <Card key={pkg.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="text-3xl font-bold mb-4">
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
                        <Button onClick={() => onEdit(pkg)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
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

              <div className="flex mt-10 items-center justify-end">
                <div className="flex flex-row items-center gap-4 mb-4">
                  <Button
                    disabled={isLoading}
                    type="button"
                    variant="outline"
                    className="ml-auto w-full sm:w-auto"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    isLoading={isLoading}
                    className="ml-auto w-full sm:w-auto"
                  >
                    Update
                  </SubmitButton>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
