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
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import React from "react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/multi-selecting";
import { createPetSitter, fetchServices } from "@/pages/api/api";
import MultiSelect from "../multiple-selector";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";

const CreatePetSitterSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phoneNumber: z.string(),
  serviceIds: z.array(z.any()).nonempty("Please select at least one person"),
  about: z.string(),
});

type DoctorFormValue = z.infer<typeof CreatePetSitterSchema>;

export default function CreatePetSitterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const form = useForm<DoctorFormValue>({
    resolver: zodResolver(CreatePetSitterSchema),
  });

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices({});
        const services = data.careServices;
        setServices(services);
      } catch (error) {
        console.error("Failed to fetch Care Services", error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  const onSubmit = async (formValues: DoctorFormValue) => {
    setLoading(true);
    try {
      const data = await createPetSitter(
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
          description: "Pet Sitter created.",
        });
        router.push("/admin/pet-sitters");
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
        <Heading title="Create Pet Sitter" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter name"
                control={form.control}
                name="name"
                label="Name"
                required={true}
              />

              <CustomFormField
                fieldType={FormFieldType.EMAIL}
                placeholder="Enter email"
                control={form.control}
                name="email"
                label="Email"
                required={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Select Services <span className="text-red-400">*</span>{" "}
                      <></>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        values={services}
                        onChange={field.onChange}
                        value={field.value || []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Phone Number"
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                required={true}
              />
            </div>

            <div className="w-full">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                placeholder="About"
                control={form.control}
                name="about"
                label="About"
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

        {/* <FormField
              control={form.control}
              name="serviceIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <MultiSelector
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Select services" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {servicesData.careServices?.map(
                          (service: CareService) => (
                            <MultiSelectorItem
                              key={service.name}
                              value={service.name}
                            >
                              <span>{service.name}</span>
                            </MultiSelectorItem>
                          )
                        )}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                  <FormDescription>Select Services</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
      </ScrollArea>
    </>
  );
}
