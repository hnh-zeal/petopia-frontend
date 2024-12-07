import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreateCafeRoomSchema } from "@/validations/formValidation";
import { useState } from "react";
import { updateCafeRoomByID } from "@/pages/api/api";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { CafeRoom } from "@/types/api";
import ImageUpload from "../ImageUpload";
import MultiImageUpload from "../MultiImageUpload";

type ServiceFormValue = z.infer<typeof CreateCafeRoomSchema>;

export default function EditCafeRoomForm({ cafeRoom }: { cafeRoom: CafeRoom }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mainImage, setMainImage] = useState<string>(cafeRoom.mainImage);
  const [images, setImages] = useState<string[]>(cafeRoom.images);

  const form = useForm<ServiceFormValue>({
    resolver: zodResolver(CreateCafeRoomSchema),
    defaultValues: {
      name: cafeRoom?.name || "",
      roomNo: cafeRoom?.roomNo || "",
      price: cafeRoom?.price,
      contact: cafeRoom?.contact,
      description: cafeRoom?.description || "",
      mainImage: cafeRoom?.mainImage || "",
      images: cafeRoom?.images || [],
    },
  });

  const onSubmit = async (formValues: ServiceFormValue) => {
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formValues,
        mainImage,
        images,
      };

      const data = await updateCafeRoomByID(cafeRoom.id, dataToSubmit);
      if (data.error) {
        toast({
          variant: "destructive",
          description: data.message,
        });
      } else {
        toast({
          variant: "success",
          description: data.message,
        });
        router.push("/admin/pet-cafe/cafe-rooms");
      }
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.reset();
    setMainImage("");
    setImages([]);
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Update Pet Cafe Room" />
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
                placeholder="Enter Cafe Room's name"
                control={form.control}
                name="name"
                label="Name"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter Room No."
                control={form.control}
                name="roomNo"
                label="Room No."
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
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
                        placeholder="Price"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage className="shad-error" />
                  </FormItem>
                )}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Contact No."
                control={form.control}
                name="contact"
                label="Contact No."
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

            <div className="flex mt-10 items-center justify-end mb-4 space-x-4">
              <div className="flex flex-row gap-4 mb-4">
                <Button
                  disabled={loading}
                  variant="outline"
                  type="button"
                  className="ml-auto w-full sm:w-auto"
                  onClick={onReset}
                >
                  Reset
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
