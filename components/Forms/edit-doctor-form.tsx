"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { CirclePlus, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { fetchDoctorByID, updateDoctorByID } from "@/pages/api/api";

async function fetchPetClinics() {
  // Call API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pet-clinics`,
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
interface EditDoctorFormProps {
  id: number;
}

export default function EditDoctorForm({ id }: EditDoctorFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [petClinicsData, setPetClinicsData] = useState({
    clinics: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const form = useForm<DoctorFormValue>({
    resolver: zodResolver(CreateDoctorSchema),
  });

  const [experiences, setExperiences] = useState([
    { from_year: "", to_year: "", position: "", location: "" },
  ]);
  const [educations, setEducations] = useState([
    { year: "", name: "", location: "" },
  ]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { from_year: "", to_year: "", position: "", location: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducations([...educations, { year: "", name: "", location: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const getPetClinics = async () => {
      setLoading(true);
      try {
        const data = await fetchPetClinics();
        setPetClinicsData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Centers", error);
      } finally {
        setLoading(false);
      }
    };

    const getDoctor = async () => {
      setLoading(true);
      try {
        const data = await fetchDoctorByID(id);
        setDoctor((prevState) => ({
          ...prevState,
          ...data,
        }));
        form.reset(data);
      } catch (error) {
        console.error("Failed to fetch Doctor", error);
      } finally {
        setLoading(false);
      }
    };

    getDoctor();
    getPetClinics();
  }, [id, form]);

  const onSubmit = async (formValues: DoctorFormValue) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        ...{ clinicId: Number(formValues.clinicId) },
      };

      const data = await updateDoctorByID(id, formData);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Doctor updated.",
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
        <Heading title="Update Doctor" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            className="w-full space-y-5 px-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Name and Email */}
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

            {/* Pet Center and Phone Number */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="clinicId"
                label="Pet Center"
                placeholder="Select Pet Center"
              >
                {petClinicsData.clinics.map((center: PetClinic, i) => (
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

            {/* About */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                placeholder="About"
                control={form.control}
                name="about"
                label="About"
              />
            </div>

            {/* Work Experiences */}
            <div className="flex flex-col gap-6">
              <div className="flex md:flex-row xl:flex-row gap-6 justify-between items-center mx-3">
                <h3 className="font-bold">Work Experiences</h3>
                <CirclePlus
                  type="button"
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={addExperience}
                />
              </div>
              {experiences.map((_, index) => (
                <Card key={index} className="flex flex-col gap-6 p-5">
                  <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                    <Controller
                      control={form.control}
                      name={`work_experiences.${index}.from_year`}
                      render={({ field }) => (
                        <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          placeholder="From Year"
                          label="From Year"
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`work_experiences.${index}.to_year`}
                      render={({ field }) => (
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.INPUT}
                          placeholder="To Year"
                          label="To Year"
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`work_experiences.${index}.position`}
                      render={({ field }) => (
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.INPUT}
                          placeholder="Position"
                          label="Position"
                          {...field}
                        />
                      )}
                    />

                    {experiences.length > 1 && (
                      <Trash2
                        type="button"
                        className="h-5 w-5 mt-7 hover:cursor-pointer"
                        onClick={() => removeExperience(index)}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-6">
                    <Controller
                      control={form.control}
                      name={`work_experiences.${index}.location`}
                      render={({ field }) => (
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.TEXTAREA}
                          placeholder="Location"
                          label="Location"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Education */}
            <div className="flex flex-col gap-6">
              <div className="flex md:flex-row xl:flex-row gap-6 justify-between items-center mx-3">
                <h3 className="font-bold">Education</h3>
                <CirclePlus
                  type="button"
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={addEducation}
                />
              </div>
              {educations.map((_, index) => (
                <Card key={index} className="flex flex-col gap-6 p-5">
                  <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                    <Controller
                      control={form.control}
                      name={`education.${index}.year`}
                      render={({ field }) => (
                        <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          placeholder="Year"
                          label="Year"
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`education.${index}.name`}
                      render={({ field }) => (
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.INPUT}
                          placeholder="Name"
                          label="Name"
                          {...field}
                        />
                      )}
                    />

                    {educations.length > 1 && (
                      <Trash2
                        type="button"
                        className="h-5 w-5 mt-7 hover:cursor-pointer"
                        onClick={() => removeEducation(index)}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-6">
                    <Controller
                      control={form.control}
                      name={`education.${index}.location`}
                      render={({ field }) => (
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.TEXTAREA}
                          placeholder="Location"
                          label="Location"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Update Button */}
            <div className="flex mt-10 items-center justify-between space-x-4">
              <div></div>
              <div className="flex items-center justify-between space-x-4">
                <Button
                  disabled={loading}
                  variant="outline"
                  className="ml-auto w-full"
                  onClick={() => router.push("/admin/doctors")}
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
