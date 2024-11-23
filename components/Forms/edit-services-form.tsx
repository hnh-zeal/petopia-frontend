"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreateServiceSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useEffect, useState } from "react";
import { fetchCategories, updateCareService } from "@/pages/api/api";
import MultiSelect from "../multiple-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { CareService } from "@/types/api";
import { Label } from "../ui/label";
import { CirclePlus, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import ImageUpload from "../ImageUpload";
import MultiImageUpload from "../MultiImageUpload";

export const serviceType = [
  { name: "Pet Sitting", value: "SITTING" },
  { name: "Pet Grooming", value: "GROOMING" },
  { name: "Pet Training", value: "TRAINING" },
];

type ServiceFormValue = z.infer<typeof CreateServiceSchema>;

export default function EditServiceForm({ service }: { service: CareService }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mainImage, setMainImage] = useState<string>(service.mainImage);
  const [images, setImages] = useState<string[]>(service.images);
  const [categories, setCategories] = useState<any>([]);
  const router = useRouter();
  const form = useForm<ServiceFormValue>({
    resolver: zodResolver(CreateServiceSchema),
    defaultValues: {
      name: service.name,
      type: service.type as any,
      description: service.description,
      categoryIds: service.categories.map((category) => category.id),
      price: service.price,
      addOns: service.addOns,
    },
  });

  const [addOns, setAddOns] = useState(
    service.addOns?.length > 0
      ? [...service.addOns]
      : [{ name: "", description: "", price: 0 }]
  );

  const addAddOn = () => {
    setAddOns([...addOns, { name: "", description: "", price: 0 }]);
  };

  const removeAddOn = (index: number) => {
    const updatedAddOns = addOns.filter((_, i) => i !== index);
    setAddOns(updatedAddOns);
  };

  const onSubmit = async (formValues: ServiceFormValue) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        mainImage,
        images,
      };

      const data = await updateCareService(service.id, formData);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Service updated successfully.",
        });
        router.push("/admin/pet-care/services");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch Categories", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Edit Pet Care Service" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-2">
                <ImageUpload
                  image={mainImage}
                  onImageUpload={(url: string) => {
                    setMainImage(url);
                  }}
                  onImageRemove={() => {
                    setMainImage("");
                  }}
                  label="Room Main Image"
                  description="Upload an image"
                />
              </div>

              <div className="p-2">
                <MultiImageUpload
                  images={images}
                  onImageUpload={(newImages: string[]) => {
                    setImages(newImages);
                  }}
                  onImageRemove={(index: number) => {
                    const updatedImages = images.filter((_, i) => i !== index);
                    setImages(updatedImages);
                    if (index === 0) {
                      setImages([]);
                    }
                  }}
                  label="Other Images"
                  description="Upload additional images for the cafe room"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter service's name"
                control={form.control}
                name="name"
                label="Name"
                required={true}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="type"
                label="Service Type"
                placeholder="Select Type"
                required={true}
              >
                {serviceType.map((type, i) => (
                  <SelectItem key={i} value={`${type.value}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{type.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Select Categories <span className="text-red-400">*</span>{" "}
                      <></>
                    </FormLabel>
                    <FormControl>
                      <>
                        <MultiSelect
                          values={categories}
                          onChange={field.onChange}
                          value={field.value || []}
                          placeholder="Select Categories"
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="shad-input-label">
                      Price <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage className="shad-error" />
                  </FormItem>
                )}
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

            <div className="flex flex-col gap-6">
              <div className="flex md:flex-row xl:flex-row gap-6 justify-between items-center mr-3">
                <Label className="font-md">Add On Services</Label>
                <CirclePlus
                  type="button"
                  className="h-5 w-5 hover:cursor-pointer"
                  onClick={addAddOn}
                />
              </div>
              {addOns?.map((_, index) => (
                <div key={index} className="flex flex-col gap-6">
                  <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                    <Controller
                      control={form.control}
                      name={`addOns.${index}.name`}
                      render={({ field }) => (
                        <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          placeholder="Name"
                          label="Name"
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`addOns.${index}.description`}
                      render={({ field }) => (
                        <CustomFormField
                          control={form.control}
                          fieldType={FormFieldType.INPUT}
                          placeholder="Description"
                          label="Description"
                          {...field}
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`addOns.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Price <span className="text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              min={0}
                            />
                          </FormControl>
                          <FormMessage className="shad-error" />
                        </FormItem>
                      )}
                    />

                    {addOns.length > 1 && (
                      <Trash2
                        type="button"
                        className="h-5 w-5 mt-7 hover:cursor-pointer"
                        onClick={() => removeAddOn(index)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex mt-10 items-center justify-between space-x-4">
              <div></div>
              <div className="flex items-center justify-between space-x-4">
                <Button
                  type="button"
                  disabled={loading}
                  variant="outline"
                  className="ml-auto w-full"
                  onClick={() => router.push(`/admin/pet-care/services`)}
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
