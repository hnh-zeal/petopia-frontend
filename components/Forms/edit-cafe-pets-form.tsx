"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { UpdateCafePetSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useEffect, useState } from "react";
import { PetClinic } from "@/constants/data";
import { ScrollArea } from "../ui/scroll-area";
import {
  fetchCafePetByID,
  fetchCafeRooms,
  updateCafePetByID,
} from "@/pages/api/api";

type CafePetFormValue = z.infer<typeof UpdateCafePetSchema>;
interface EditCafePetFormProps {
  id: number;
  onClose: any;
}

export default function EditCafePetForm({ id, onClose }: EditCafePetFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cafePet, setCafePet] = useState({});
  const [roomData, setRoomData] = useState({
    rooms: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const form = useForm<CafePetFormValue>({
    resolver: zodResolver(UpdateCafePetSchema),
  });

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      try {
        const data = await fetchCafeRooms();
        setRoomData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Centers", error);
      } finally {
        setLoading(false);
      }
    };

    const getCafePet = async () => {
      setLoading(true);
      try {
        const data = await fetchCafePetByID(id);
        setCafePet((prevState) => ({
          ...prevState,
          ...data,
        }));
        form.reset(data);
      } catch (error) {
        console.error("Failed to fetch Cafe Pet", error);
      } finally {
        setLoading(false);
      }
    };

    getCafePet();
    getRooms();
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
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Name"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                placeholder="Room"
                control={form.control}
                name="roomId"
                label="Room"
              >
                {roomData.rooms.map((room: PetClinic, i) => (
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
                placeholder="Birth Date"
                control={form.control}
                name="dateOfBirth"
                label="Birth Date"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Age"
                control={form.control}
                name="age"
                label="Age"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              {/* <CustomFormField
                fieldType={FormFieldType.SELECT}
                placeholder="Pet Type"
                control={form.control}
                name="petType"
                label="Pet Type"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                placeholder="Age"
                control={form.control}
                name="dateOfBirth"
                label="Breed"
              /> */}
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

            <div className="flex mt-10 items-center justify-between space-x-4">
              <div></div>
              <div className="flex items-center justify-between space-x-4">
                <Button
                  disabled={loading}
                  variant="outline"
                  type="button"
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
