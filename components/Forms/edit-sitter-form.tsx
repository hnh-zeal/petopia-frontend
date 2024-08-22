"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreatePetSitterSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useEffect, useState } from "react";
import { CareService } from "@/constants/data";
import { ScrollArea } from "../ui/scroll-area";

async function fetchCareServices() {
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

async function fetchPetSitterByID(id: string) {
  // Call API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-sitters/${id}`,
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

type PetSitterFormValue = z.infer<typeof CreatePetSitterSchema>;
interface EditPetSitterFormProps {
  id: string;
}

export default function EditSitterForm({ id }: EditPetSitterFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [petSitterData, setPetSitterData] = useState({});
  const [servicesData, setServicesData] = useState({
    careServices: [],
    count: 0,
  });

  const router = useRouter();

  const form = useForm<PetSitterFormValue>({
    resolver: zodResolver(CreatePetSitterSchema),
    defaultValues: {
      name: "",
      email: "",
      careServiceId: "",
      phoneNumber: "",
      about: "",
    },
  });

  useEffect(() => {
    const getPetClinics = async () => {
      setLoading(true);
      try {
        const data = await fetchCareServices();
        setServicesData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Care Services", error);
      } finally {
        setLoading(false);
      }
    };

    const getPetSitter = async () => {
      setLoading(true);
      try {
        const data = await fetchPetSitterByID(id);
        setPetSitterData((prevState) => ({
          ...prevState,
          ...data,
        }));
        form.reset(data);
      } catch (error) {
        console.error("Failed to fetch PetSitter", error);
      } finally {
        setLoading(false);
      }
    };

    getPetSitter();
    getPetClinics();
  }, [id, form]);

  const onSubmit = async (formValues: PetSitterFormValue) => {
    setLoading(true);
    try {
      // Call API
      const formData = {
        ...formValues,
        ...{ careServiceId: Number(formValues.careServiceId) },
      };
      console.log(formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pet-sitters/${id}`,
        {
          method: "PATCH",
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
        router.push("/admin/pet-sitters");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/admin/pet-sitters");
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Edit Pet Sitter" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5"
          >
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Name"
              />

              <CustomFormField
                fieldType={FormFieldType.EMAIL}
                placeholder="Enter petSitter's email"
                control={form.control}
                name="email"
                label="Email"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="careServiceId"
                label="Pet Care Services"
                placeholder="Select Pet Care Services"
              >
                {servicesData.careServices.map((service: CareService, i) => (
                  <SelectItem key={service.name + i} value={`${service.id}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{service.name}</p>
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

            <div className="flex mt-10 items-center justify-between space-x-4">
              <div></div>
              <div className="flex items-center justify-between space-x-4">
                <Button
                  disabled={loading}
                  variant="outline"
                  className="ml-auto w-full"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={loading} className="ml-auto w-full">
                  Update
                </SubmitButton>
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </>
  );
}
