"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { UpdateCafePetSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
  fetchCafePetByID,
  fetchCafeRooms,
  updateCafePetByID,
} from "@/pages/api/api";
import { useFetchList } from "@/hooks/useFetchList";
import { CafeRoom } from "@/types/api";
import ImageUpload from "../ImageUpload";

type CafePetFormValue = z.infer<typeof UpdateCafePetSchema>;
interface EditCafePetFormProps {
  id: number;
  onClose: any;
}

export default function EditCafePetForm({ id, onClose }: EditCafePetFormProps) {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [cafePet, setCafePet] = useState({});

  const fetchRooms = useCallback(() => fetchCafeRooms({}), []);
  const { data } = useFetchList(fetchRooms);

  const form = useForm<CafePetFormValue>({
    resolver: zodResolver(UpdateCafePetSchema),
  });

  useEffect(() => {
    const getCafePet = async () => {
      setLoading(true);
      try {
        const data = await fetchCafePetByID(id);
        setCafePet((prevState) => ({
          ...prevState,
          ...data,
        }));
        setImageUrl(data.imageUrl);
        form.reset(data);
      } catch (error) {
        console.error("Failed to fetch Cafe Pet", error);
      } finally {
        setLoading(false);
      }
    };

    getCafePet();
  }, [id, form]);

  const onSubmit = async (formValues: CafePetFormValue) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        ...{ roomId: Number(formValues.roomId) },
      };

      const data = await updateCafePetByID(id, formData);

      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Cafe Pet updated.",
        });
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    onClose();
    form.reset();
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5"
          >
            <div className="w-1/2 p-2">
              <ImageUpload
                image={imageUrl}
                onImageUpload={(url: string) => {
                  setImageUrl(url);
                }}
                onImageRemove={() => {
                  setImageUrl("");
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
                required={true}
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                placeholder="Room"
                control={form.control}
                name="roomId"
                label="Room"
                required={true}
              >
                {data.data.map((room: CafeRoom, i: number) => (
                  <SelectItem key={room.name + i} value={`${room.id}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{room.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                required={true}
                placeholder="Birth Date"
                control={form.control}
                name="dateOfBirth"
                label="Birth Date"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                placeholder="About"
                control={form.control}
                name="description"
                label="About"
              />
            </div>

            <div className="flex mt-10 items-center justify-end">
              <div className="flex flex-row items-center gap-4 mb-4">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  type="button"
                  className="ml-auto w-full sm:w-auto"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <SubmitButton
                  isLoading={isLoading}
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
