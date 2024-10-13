"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import MultiSelect from "../multiple-selector";
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
import { PetSitter } from "@/types/api";
import { fetchServices, updatePetSitterByID } from "@/pages/api/api";
import { CreatePetSitterSchema } from "./create-sitter-form";
import { Input } from "../ui/input";
import { Plus, Trash, Trash2 } from "lucide-react";

type PetSitterFormValue = z.infer<typeof CreatePetSitterSchema>;
interface EditPetSitterFormProps {
  petSitter: PetSitter;
}

export default function EditSitterForm({ petSitter }: EditPetSitterFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const petServices = petSitter.services.map((service: any) => service.id);
  const router = useRouter();

  const form = useForm<PetSitterFormValue>({
    resolver: zodResolver(CreatePetSitterSchema),
    defaultValues: {
      name: petSitter.name,
      email: petSitter.email,
      serviceIds: petServices,
      phoneNumber: petSitter.phoneNumber,
      about: petSitter.about,
      specialties:
        petSitter.specialties?.length > 0 ? petSitter.specialties : [" "],
      languages: petSitter.languages?.length > 0 ? petSitter.languages : [" "],
    },
  });

  const {
    fields: specialtiesFields,
    append: appendSpecialty,
    remove: removeSpecialty,
  } = useFieldArray({
    control: form.control,
    name: "specialties",
  });

  const {
    fields: languagesFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: form.control,
    name: "languages",
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

    setMounted(true);
    getServices();
  }, []);

  if (!mounted) {
    return null;
  }

  const onSubmit = async (formValues: PetSitterFormValue) => {
    setLoading(true);
    try {
      const data = await updatePetSitterByID(petSitter.id, formValues);

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
            className="w-full space-y-5 px-2"
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
                        placeholder="Choose services"
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
              />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="flex flex-col gap-3">
                <FormLabel>Specialties</FormLabel>
                <div className="flex flex-col gap-3">
                  {/* Map over the specialties fields */}
                  {specialtiesFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-center">
                      <Input
                        {...form.register(`specialties.${index}` as const)}
                        placeholder="Enter specialty"
                      />

                      {index === specialtiesFields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => appendSpecialty("")}
                          className="px-2"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}

                      {specialtiesFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeSpecialty(index)}
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
                <FormLabel>Languages</FormLabel>
                <div className="flex flex-col gap-3">
                  {languagesFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-center">
                      <Input
                        {...form.register(`languages.${index}` as const)}
                        placeholder="Enter languages"
                      />

                      {index === languagesFields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => appendLanguage("")}
                          className="px-2"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}

                      {languagesFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeLanguage(index)}
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
