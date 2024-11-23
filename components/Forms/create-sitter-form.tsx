"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "../ui/scroll-area";
import React from "react";
import {
  createPetSitter,
  fetchServices,
  singleFileUpload,
} from "@/pages/api/api";
import MultiSelect from "../multiple-selector";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import ProfilePictureUpload from "../Layout/profile-upload";

export const CreatePetSitterSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phoneNumber: z.string(),
  serviceIds: z.array(z.any()).nonempty("Please select at least one service."),
  specialties: z.any(z.string()).optional(),
  languages: z.any(z.string()).optional(),
  profile: z.any().optional(),
  about: z.any().optional(),
});

type DoctorFormValue = z.infer<typeof CreatePetSitterSchema>;

export default function CreatePetSitterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const router = useRouter();
  const adminAuth = useRecoilValue(userAuthState);

  const form = useForm<DoctorFormValue>({
    resolver: zodResolver(CreatePetSitterSchema),
    defaultValues: {
      specialties: [" "],
      languages: [" "],
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
        setServices(data.careServices);
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
      const { profile, ...otherValues } = formValues;
      let profileUrl;

      if (profile instanceof File) {
        const fileData = await singleFileUpload(
          { file: profile, isPublic: false },
          adminAuth?.accessToken as string
        );

        if (fileData.error) {
          toast({
            variant: "destructive",
            description: fileData.message,
          });
          return;
        }

        profileUrl = fileData.url;
      }

      const formData = {
        ...otherValues,
        profileUrl,
      };

      const data = await createPetSitter(
        formData,
        adminAuth?.accessToken as string
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
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="shad-input-label">
                    Profile Picture
                  </FormLabel>
                  <FormControl>
                    <ProfilePictureUpload field={field} defaultImage={""} />
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />

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
              {/* Multi-Select for Services */}
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Select Services <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        values={services}
                        onChange={field.onChange}
                        value={field.value || []}
                        placeholder="Select Services"
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

                      {/* Plus button: only on the last item */}
                      {index === specialtiesFields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => appendSpecialty("")}
                          className="px-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Trash button: shown if there is more than one input */}
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
                  {/* Map over the specialties fields */}
                  {languagesFields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-center">
                      <Input
                        {...form.register(`languages.${index}` as const)}
                        placeholder="Enter languages"
                      />

                      {/* Plus button: only on the last item */}
                      {index === languagesFields.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => appendLanguage("")}
                          className="px-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Trash button: shown if there is more than one input */}
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

            <div className="w-full">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                placeholder="About"
                control={form.control}
                name="about"
                label="About"
              />
            </div>

            <div className="flex mt-10 items-center justify-end space-x -4">
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
