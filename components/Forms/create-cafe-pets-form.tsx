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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export const petType = [
  { name: "Cat", value: "cat" },
  { name: "Dog", value: "dog" },
  { name: "Rabbit", value: "rabbit" },
  { name: "Bird", value: "bird" },
];

export const breeds: any = {
  cat: [
    { name: "Siamese", value: "siamese" },
    { name: "Persian", value: "persian" },
    { name: "Maine Coon", value: "maine_coon" },
    // Add more cat breeds
  ],
  dog: [
    { name: "Labrador Retriever", value: "labrador" },
    { name: "German Shepherd", value: "german_shepherd" },
    { name: "Golden Retriever", value: "golden_retriever" },
    // Add more dog breeds
  ],
  rabbit: [
    { name: "Holland Lop", value: "holland_lop" },
    { name: "Netherland Dwarf", value: "netherland_dwarf" },
    // Add more rabbit breeds
  ],
  bird: [
    { name: "Parakeet", value: "parakeet" },
    { name: "Canary", value: "canary" },
    // Add more bird breeds
  ],
};

export const durationType = [
  { name: "Days", value: "days" },
  { name: "Weeks", value: "weeks" },
  { name: "Months", value: "months" },
  { name: "Years", value: "years" },
];

export const discountPercents = [
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

const CreatePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  petType: z.string().min(1, { message: "Pet Type is required." }),
  breed: z.string().min(1, { message: "Breed is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  year: z.number(),
  month: z.number(),
  sex: z.string(),
  roomId: z.string(),
});

type PackagesFormValue = z.infer<typeof CreatePetSchema>;

export default function CreateCafePetsForm() {
  const auth = useRecoilValue(adminAuthState);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selectedPetType, setSelectedPetType] = useState("");

  const handlePetTypeChange = (value: string) => {
    setSelectedPetType(value);
    form.setValue("petType", value);
    form.setValue("breed", "");
  };

  const form = useForm<PackagesFormValue>({
    resolver: zodResolver(CreatePetSchema),
    defaultValues: {
      name: "",
      petType: "",
      breed: "",
      description: "",
      year: undefined,
      month: undefined,
      sex: "",
      roomId: "",
    },
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
        <Heading title="Create Pet" />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5 px-2"
        >
          <div className="grid grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Enter pet's name"
              control={form.control}
              name="name"
              label="Name"
              required={true}
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="petType"
              label="Pet Type"
              placeholder="Select Type"
              required={true}
            >
              {petType.map((type, i) => (
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
                name="petType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      End Time<span className="text-red-400"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={handlePetTypeChange}
                      >
                        <SelectTrigger
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <div className="flex flex-row items-center gap-3">
                            <SelectValue placeholder="Select Pet Type" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {petType.map((type, i) => (
                            <SelectItem key={i} value={`${type.value}`}>
                              <div className="flex cursor-pointer items-center gap-2">
                                <p>{type.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="breed"
                label="Breed"
                placeholder="Select Breed"
                required={true}
              >
                {(breeds[selectedPetType] || []).map(
                  (breed: any, i: number) => (
                    <SelectItem key={i} value={breed.value}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{breed.name}</p>
                      </div>
                    </SelectItem>
                  )
                )}
              </CustomFormField>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="year"
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
