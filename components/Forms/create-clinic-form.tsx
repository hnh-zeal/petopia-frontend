import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { useToast } from "../ui/use-toast";
import { CreatePetClinicSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { CirclePlus, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import SubmitButton from "../submit-button";
import { daysOfWeek } from "@/constants/data";

type PetClinicFormValue = z.infer<typeof CreatePetClinicSchema>;

export default function CreatePetClinicForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([
    { dow: "", startTime: "", endTime: "" },
  ]);
  const [treatments, setTreatments] = useState([""]);
  const [tools, setTools] = useState([""]);

  const router = useRouter();
  const form = useForm<PetClinicFormValue>({
    resolver: zodResolver(CreatePetClinicSchema),
  });

  const addSection = () => {
    setSections([...sections, { dow: "", startTime: "", endTime: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addTreatment = (index: number) => {
    setTreatments([...treatments, "index"]);
  };

  const addTool = (index: number) => {
    setTools([...tools, "index"]);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const removeTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  const onSubmit = async (formValues: PetClinicFormValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pet-clinics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "PetClinic created.",
        });
        router.push("/admin/pet-clinic/pet-centers");
      }
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.reset();
    setSections([{ dow: "", startTime: "", endTime: "" }]);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Create PetClinic" />
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
                placeholder="Enter pet-clinic's name"
                control={form.control}
                name="name"
                label="Name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Contact Number"
                control={form.control}
                name="contact"
                label="Contact No."
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              placeholder="Description"
              control={form.control}
              name="description"
              label="Description"
            />

            <h3 className="font-bold">Operating Hours</h3>
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
            </div>

            <h3 className="font-bold">Treatments and Tools</h3>
            <div className="flex flex-col gap-6">
              <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                <Controller
                  control={form.control}
                  name="treatments"
                  render={({ field }) => (
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      placeholder="Treatments"
                      label="Treatments"
                      {...field}
                    />
                  )}
                />
                <CirclePlus
                  type="button"
                  className="h-5 w-5 mt-7 hover:cursor-pointer"
                  onClick={addTreatment}
                />
                {sections.length > 1 && (
                  <Trash2
                    type="button"
                    className="h-5 w-5 mt-7 hover:cursor-pointer"
                    onClick={() => removeTreatment(index)}
                  />
                )}
              </div>

              <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                <Controller
                  control={form.control}
                  name="tools"
                  render={({ field }) => (
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.INPUT}
                      placeholder="Choose Tools"
                      label="Tools"
                      {...field}
                    ></CustomFormField>
                  )}
                />
                <CirclePlus
                  type="button"
                  className="h-5 w-5 mt-7 hover:cursor-pointer"
                  onClick={addTool}
                />

                {/* Tools */}
              </div>
            </div>

            {/* <h3 className="font-bold">Photos</h3>
            <div className="flex flex-col gap-6">
              <Controller
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.FILE}
                    placeholder="Upload Photos"
                    label="Photos"
                    {...field}
                  />
                )}
              />
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
      </ScrollArea>
    </>
  );
}
