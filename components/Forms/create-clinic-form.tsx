import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { useToast } from "../ui/use-toast";
import { CreatePetClinicSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import SubmitButton from "../submit-button";
import { daysOfWeek } from "@/constants/data";
import { Input } from "../ui/input";
import ImageUpload from "../ImageUpload";

type PetClinicFormValue = z.infer<typeof CreatePetClinicSchema>;

export default function CreatePetClinicForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [sections, setSections] = useState([
    { dow: "", startTime: "", endTime: "" },
  ]);

  const router = useRouter();
  const form = useForm<PetClinicFormValue>({
    resolver: zodResolver(CreatePetClinicSchema),
    defaultValues: {
      treatment: [" "],
      tools: [" "],
    },
  });

  const addSection = () => {
    setSections([...sections, { dow: "", startTime: "", endTime: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const {
    fields: treatmentFields,
    append: appendTreatment,
    remove: removeTreatment,
  } = useFieldArray({
    control: form.control,
    name: "treatment",
  });

  const {
    fields: toolsFields,
    append: appendTools,
    remove: removeTools,
  } = useFieldArray({
    control: form.control,
    name: "tools",
  });

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
          body: JSON.stringify({ ...formValues, mainImage }),
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
        <Heading title="Create Pet Clinic" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-200px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <div className="w-1/2">
              <ImageUpload
                image={""}
                onImageUpload={(url: string) => {
                  setMainImage(url);
                }}
                onImageRemove={() => {
                  setMainImage("");
                }}
                label="Clinic Image"
                description="Upload an image"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter pet-clinic's name"
                control={form.control}
                name="name"
                label="Name"
                required={true}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Contact Number"
                control={form.control}
                name="contact"
                label="Contact No."
                required={true}
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              placeholder="Description"
              control={form.control}
              name="description"
              label="Description"
              required={true}
            />

            <h3 className="font-bold">Operating Hours</h3>
            <div className="flex flex-col gap-6">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className="flex md:flex-row xl:flex-row gap-3 items-center"
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
                        required={true}
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
                        required={true}
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
                        required={true}
                        {...field}
                      />
                    )}
                  />
                  {sections.length > 1 && (
                    <Button
                      variant="ghost"
                      className="hover:cursor-pointer mt-7 px-2"
                      onClick={() => removeSection(index)}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    type="button"
                    className="hover:cursor-pointer mt-7 px-2"
                    onClick={addSection}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-3">
                <FormLabel>Treatments</FormLabel>
                <div className="flex flex-col gap-3">
                  {treatmentFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-center">
                      <Input
                        {...form.register(`treatment.${index}` as const)}
                        placeholder="Enter specialty"
                      />

                      {index === treatmentFields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => appendTreatment("")}
                          className="px-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {treatmentFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeTreatment(index)}
                          className="px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FormLabel>Tools</FormLabel>
                <div className="flex flex-col gap-3">
                  {toolsFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-center">
                      <Input
                        {...form.register(`tools.${index}` as const)}
                        placeholder="Enter tools"
                      />

                      {index === toolsFields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => appendTools("")}
                          className="px-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {toolsFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeTools(index)}
                          className="px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex mt-10 items-center justify-end space-x-4">
              <div className="flex items-center justify-end space-x-4 mb-4">
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
