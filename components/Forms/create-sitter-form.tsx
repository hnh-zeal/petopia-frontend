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
import { CreateDoctorSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useEffect, useState } from "react";
import { PetClinic } from "@/constants/data";

async function fetchPetClinics() {
  // Call API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/care-services`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Pet Clinics");
  }

  const data = await response.json();
  return data;
}

type DoctorFormValue = z.infer<typeof CreateDoctorSchema>;

export default function CreatePetSitterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [servicesData, setServicesData] = useState({
    careServices: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });

  const router = useRouter();
  const form = useForm<DoctorFormValue>({
    resolver: zodResolver(CreateDoctorSchema),
  });

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      try {
        const data = await fetchPetClinics();
        setServicesData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Centers", error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  const onSubmit = async (formValues: DoctorFormValue) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        ...{ clinicId: Number(formValues.clinicId) },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Doctor created.",
        });
        router.push("/admin/doctors");
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5 px-2"
        >
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Enter doctor's name"
              control={form.control}
              name="name"
              label="Name"
            />

            <CustomFormField
              fieldType={FormFieldType.EMAIL}
              placeholder="Enter doctor's email"
              control={form.control}
              name="email"
              label="Email"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="clinicId"
              label="Pet Center"
              placeholder="Select Pet Center"
            >
              {servicesData.careServices.map((center: PetClinic, i) => (
                <SelectItem key={center.name + i} value={`${center.id}`}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{center.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Phone Number"
              control={form.control}
              name="phoneNumber"
              label="Phone Number"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              placeholder="About"
              control={form.control}
              name="about"
              label="About"
            />
          </div>

          {/* <h3 className="font-bold">Specialty</h3>
          <div className="flex flex-col gap-6">
            {sections.map((_, index) => (
              <div
                key={index}
                className="flex md:flex-row xl:flex-row gap-6 items-center"
              >
                <Controller
                  control={form.control}
                  name={`sections.${index}.dow`}
                  render={({ field }) => (
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      placeholder="Choose days of week"
                      label="Days of week"
                      {...field}
                    >
                      {daysOfWeek.map((day, i) => (
                        <SelectItem key={day + i} value={day}>
                          <div className="flex cursor-pointer items-center gap-2">
                            <p>{day}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </CustomFormField>
                  )}
                />

                <Controller
                  control={form.control}
                  name={`sections.${index}.startTime`}
                  render={({ field }) => (
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.TIME}
                      placeholder="Start Time"
                      label="Start Time"
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name={`sections.${index}.endTime`}
                  render={({ field }) => (
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.TIME}
                      placeholder="End Time"
                      label="End Time"
                      {...field}
                    />
                  )}
                />

                {sections.length > 1 && (
                  <Trash2
                    type="button"
                    className="h-5 w-5 mt-7 hover:cursor-pointer"
                    onClick={() => removeSection(index)}
                  />
                )}
                <CirclePlus
                  type="button"
                  className="h-5 w-5 mt-7 hover:cursor-pointer"
                  onClick={addSection}
                />
              </div>
            ))}
          </div> */}

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
