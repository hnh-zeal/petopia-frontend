"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreateServiceSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useEffect, useState } from "react";
import { createCareService, fetchCategories } from "@/pages/api/api";
import MultiSelect from "../multiple-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { GetServerSideProps } from "next";
import { Category } from "@/types/api";

export const serviceType = [
  { name: "Pet Sitting", value: "SITTING" },
  { name: "Pet Grooming", value: "GROOMING" },
  { name: "Pet Training", value: "TRAINING" },
];

export const getServerSideProps: GetServerSideProps<{
  categories: Category;
}> = async (context) => {
  try {
    const categoryData = await fetchCategories();
    console.log(categoryData);
    return { props: { categories: categoryData.categories } };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      notFound: true,
    };
  }
};

type ServiceFormValue = z.infer<typeof CreateServiceSchema>;

export default function CreateServiceForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[] | any>();
  const router = useRouter();
  const form = useForm<ServiceFormValue>({
    resolver: zodResolver(CreateServiceSchema),
  });

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data.categories as any);
      } catch (error) {
        console.error("Failed to fetch Categories", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const onSubmit = async (formValues: ServiceFormValue) => {
    setLoading(true);
    try {
      const data = await createCareService(formValues);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Service created.",
        });
        router.push("/admin/pet-care/services");
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
              placeholder="Enter service's name"
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
              {serviceType.map((type, i) => (
                <SelectItem key={i} value={`${type.value}`}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{type.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Services <span className="text-red-400">*</span>{" "}
                    <></>
                  </FormLabel>
                  <FormControl>
                    <>
                      {<>{console.log(categories)}</>}
                      <MultiSelect
                        values={categories}
                        onChange={field.onChange}
                        value={field.value || []}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              placeholder="Description"
              control={form.control}
              name="description"
              label="Description"
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
