"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreateCafeRoomSchema } from "@/validations/formValidation";
import { useState } from "react";
import { createCafeRoom } from "@/pages/api/api";
import { ScrollArea } from "../ui/scroll-area";

type ServiceFormValue = z.infer<typeof CreateCafeRoomSchema>;

export default function CreateCafeRoomForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<ServiceFormValue>({
    resolver: zodResolver(CreateCafeRoomSchema),
    defaultValues: {
      name: "",
      roomNo: "",
      price: "",
      roomType: "",
      description: "",
    },
  });

  const onSubmit = async (formValues: ServiceFormValue) => {
    setLoading(true);
    try {
      const data = await createCafeRoom(formValues);
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
        router.push("/admin/pet-cafe/cafe-rooms");
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
        <Heading title="Create Pet Cafe Room" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Cafe Room's name"
                control={form.control}
                name="name"
                label="Name"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Room No."
                control={form.control}
                name="roomNo"
                label="Room No."
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Price"
                control={form.control}
                name="price"
                label="Price"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Room Type."
                control={form.control}
                name="roomType"
                label="Room Type"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Facilities"
                control={form.control}
                name="facilities"
                label="Facilities"
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
              <div className="flex items-center justify-around space-x-4">
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
      </ScrollArea>
    </>
  );
}
