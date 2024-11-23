"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { Form, FormLabel } from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { Clinic } from "@/types/api";
import { updatePetClinicByID } from "@/pages/api/api";
import { Input } from "../ui/input";
import { Plus, PlusCircle, Trash2 } from "lucide-react";
import { CreatePetClinicSchema } from "@/validations/formValidation";
import { daysOfWeek } from "@/constants/data";
import { SelectItem } from "../ui/select";
import ImageUpload from "../ImageUpload";

type PetSitterFormValue = z.infer<typeof CreatePetClinicSchema>;

export default function EditPetClinicForm({
  petClinic,
}: {
  petClinic: Clinic;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState<string>(petClinic.mainImage);
  const [sections, setSections] = useState([
    { dow: "", startTime: "", endTime: "" },
  ]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const form = useForm<PetSitterFormValue>({
    resolver: zodResolver(CreatePetClinicSchema),
    defaultValues: {
      name: petClinic.name,
      contact: petClinic.contact,
      description: petClinic.description,
      sections: petClinic.operatingHours,
      treatment: petClinic.treatment?.length > 0 ? petClinic.treatment : [" "],
      tools: petClinic.tools?.length > 0 ? petClinic.tools : [" "],
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const onSubmit = async (formValues: PetSitterFormValue) => {
    setLoading(true);
    try {
      const { sections, ...values } = formValues;
      const formData = {
        ...values,
        operatingHours: sections,
        mainImage,
      };

      const data = await updatePetClinicByID(petClinic.id, formData);

      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: `${data.message}`,
        });
        router.push("/admin/pet-clinic/pet-centers");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/admin/pet-clinic/pet-centers");
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Edit Pet Clinic" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-200px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <div className="w-1/2 p-2">
              <ImageUpload
                image={mainImage}
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
                          <Plus className="w-4 h-4" />
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
                          <Plus className="w-4 h-4" />
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
                  type="button"
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
