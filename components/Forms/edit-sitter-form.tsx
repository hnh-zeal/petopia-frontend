"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { PetSitter } from "@/types/api";
import {
  deleteFile,
  fetchServices,
  singleFileUpload,
  updatePetSitterByID,
} from "@/pages/api/api";
import { CreatePetSitterSchema } from "./create-sitter-form";
import { Input } from "../ui/input";
import { Plus, Trash2 } from "lucide-react";
import ProfilePictureUpload from "../Layout/profile-upload";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";

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
  const adminAuth = useRecoilValue(adminAuthState);
  const [imageUrl, setImageUrl] = useState(petSitter.profileUrl);

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
      const { profile, ...otherValues } = formValues;
      let profileUrl;

      if (profile instanceof File) {
        // Delete the file first
        if (petSitter.profileUrl) {
          const key = petSitter.profileUrl.split("/").pop() as string;
          await deleteFile(key, adminAuth?.accessToken as string);
        }

        // Upload
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

      const data = await updatePetSitterByID(petSitter.id, formData);

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
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="shad-input-label">
                    Profile Picture
                  </FormLabel>
                  <FormControl>
                    <ProfilePictureUpload
                      field={field}
                      defaultImage={petSitter.profileUrl}
                      setImageUrl={setImageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />

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

            <div className="flex mt-10 items-center justify-end">
              <div className="flex flex-row items-center gap-4 mb-4">
                <Button
                  disabled={loading}
                  type="button"
                  variant="outline"
                  className="ml-auto w-full sm:w-auto"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <SubmitButton
                  isLoading={loading}
                  className="ml-auto w-full sm:w-auto"
                >
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
