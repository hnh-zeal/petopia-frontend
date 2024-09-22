"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { createPackages } from "@/pages/api/api";
import { SelectItem } from "../ui/select";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { Input } from "../ui/input";

const packagesType = [
  { name: "Pet Clinic", value: "CLINIC" },
  { name: "Pet Care", value: "CARE" },
  { name: "Pet Cafe", value: "CAFE" },
];

const durationType = [
  { name: "Days", value: "DAY" },
  { name: "Weeks", value: "WEEK" },
  { name: "Months", value: "MONTH" },
  { name: "Years", value: "YEAR" },
];

const discountPercents = [
  { name: "10 %", value: 10 },
  { name: "20 %", value: 20 },
  { name: "25 %", value: 25 },
  { name: "30 %", value: 30 },
  { name: "40 %", value: 40 },
  { name: "50 %", value: 50 },
  { name: "60 %", value: 60 },
  { name: "75 %", value: 75 },
  { name: "80 %", value: 80 },
];

const CreatePackageSchema = z.object({
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

type PackagesFormValue = z.infer<typeof CreatePackageSchema>;

export default function CreatePackagesForm() {
  const auth = useRecoilValue(adminAuthState);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<PackagesFormValue>({
    resolver: zodResolver(CreatePackageSchema),
  });

  const onSubmit = async (formValues: PackagesFormValue) => {
    setLoading(true);
    try {
      const data = await createPackages(
        formValues,
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
          description: "Package created.",
        });
        router.push("/admin/packages");
      }
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.reset();
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Create Pet Care Service" />
      </div>
      <Separator />
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

          <div className="grid grid-cols-2 gap-6 xl:flex-row">
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                {durationType.map((type, i) => (
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
                        placeholder="Price"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
              <Button
                disabled={loading}
                variant="outline"
                className="ml-auto w-full"
                onClick={onReset}
              >
                Reset
              </Button>
              <SubmitButton isLoading={loading} className="ml-auto w-full">
                Create
              </SubmitButton>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
