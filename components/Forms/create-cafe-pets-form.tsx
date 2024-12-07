"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { useCallback, useState } from "react";
import { createCafePets, fetchCafeRooms } from "@/pages/api/api";
import { SelectItem } from "../ui/select";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { cn } from "@/lib/utils";
import { breeds, GenderOptions, petTypes } from "@/constants/data";
import { CafeRoom } from "@/types/api";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import ImageUpload from "../ImageUpload";
import { useFetchList } from "@/hooks/useFetchList";

const CreatePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  petType: z.string().min(1, { message: "Pet Type is required." }),
  breed: z.string().min(1, { message: "Breed is required." }),
  roomId: z.string().min(1, { message: "Cafe Room is required." }),
  dateOfBirth: z.date(),
  year: z.number().optional(),
  month: z.number().optional(),
  sex: z.string().min(1, { message: "Gender is required." }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type PackagesFormValue = z.infer<typeof CreatePetSchema>;

export default function CreateCafePetsForm() {
  const auth = useRecoilValue(adminAuthState);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<PackagesFormValue>({
    resolver: zodResolver(CreatePetSchema),
    defaultValues: {
      name: "",
      petType: "",
      breed: "",
      description: "",
      year: 0,
      month: 0,
      sex: "",
      roomId: "",
      imageUrl: "",
    },
  });

  const fetchRooms = useCallback(() => fetchCafeRooms({}), []);
  const { data, loading, error } = useFetchList(fetchRooms);

  const onSubmit = async (formValues: PackagesFormValue) => {
    setIsLoading(true);
    try {
      const dataToSubmit = {
        ...formValues,
        imageUrl,
      };

      const data = await createCafePets(
        dataToSubmit,
        auth?.accessToken as string
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Pet created successfully.",
        });
        router.push("/admin/pet-cafe/pets");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onReset = () => {
    form.reset();
    setImageUrl("");
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Create Pet" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <div className="w-1/2 p-2">
              <ImageUpload
                image={""}
                onImageUpload={(url: string) => {
                  setImageUrl(url);
                }}
                onImageRemove={() => {
                  setImageUrl("");
                }}
                label="Pet Image"
                description="Upload an image"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter pet's name"
                control={form.control}
                name="name"
                label="Name"
                required={true}
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="roomId"
                label="Cafe Room"
                placeholder="Select Room"
                required={true}
              >
                {data?.data?.map((room: CafeRoom, i: number) => (
                  <SelectItem key={i} value={`${room.id}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{room.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <div className="grid grid-cols-2 gap-6 xl:flex-row">
              <div className="grid grid-cols-2 gap-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="petType"
                  label="Pet Type"
                  placeholder="Select Pet Type"
                  required={true}
                >
                  {petTypes.map((pet, i) => (
                    <SelectItem key={i} value={pet.value}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{pet.label}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="breed"
                  label="Breed"
                  placeholder="Select Breed"
                >
                  {breeds[form.watch("petType") as keyof typeof breeds]?.map(
                    (breed: any, i: number) => (
                      <SelectItem key={breed} value={breed.value}>
                        {breed.label}
                      </SelectItem>
                    )
                  )}
                </CustomFormField>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="Select Breed"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="sex"
                  label="Sex"
                  renderSkeleton={(field) => (
                    <>
                      <FormControl>
                        <RadioGroup
                          className="flex py-3 px-2 gap-3 xl:justify-between"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {GenderOptions.map((option, i) => (
                            <div
                              key={option + i}
                              className="radio-group flex flex-row gap-3"
                            >
                              <RadioGroupItem value={option} id={option} />
                              <Label
                                htmlFor={option}
                                className="cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </>
                  )}
                />
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

            <div className="flex mt-10 items-center justify-end">
              <div className="flex flex-row items-center gap-4 mb-4">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant="outline"
                  className="ml-auto w-full sm:w-auto"
                  onClick={onReset}
                >
                  Reset
                </Button>
                <SubmitButton
                  isLoading={isLoading}
                  className="ml-auto w-full sm:w-auto"
                >
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
