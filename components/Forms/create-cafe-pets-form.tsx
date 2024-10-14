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
import { useEffect, useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

export const durationType = [
  { name: "Days", value: "days" },
  { name: "Weeks", value: "weeks" },
  { name: "Months", value: "months" },
  { name: "Years", value: "years" },
];

export const discountPercents = [
  { name: "10 %", value: 10 },
  { name: "20 %", value: 20 },
  { name: "25 %", value: 25 },
  { name: "30 %", value: 30 },
  { name: "40 %", value: 40 },
  { name: "50 %", value: 50 },
  { name: "60 %", value: 60 },
  { name: "75 %", value: 75 },
  { name: "80 %", value: 80 },
];

const CreatePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  petType: z.string().min(1, { message: "Pet Type is required." }),
  breed: z.string().min(1, { message: "Breed is required." }),
  description: z.string().optional(),
  roomId: z.string(),
  dateOfBirth: z.date().optional(),
  year: z.number().optional(),
  month: z.number().optional(),
  sex: z.any().optional(),
  medication: z.string().optional(),
});

type PackagesFormValue = z.infer<typeof CreatePetSchema>;

export default function CreateCafePetsForm() {
  const auth = useRecoilValue(adminAuthState);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [rooms, setRooms] = useState<CafeRoom[]>();

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
    },
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await fetchCafeRooms();
        setRooms(data.rooms);
      } catch (error) {
        console.error("Failed to fetch Cafe Rooms", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const onSubmit = async (formValues: PackagesFormValue) => {
    setLoading(true);
    try {
      const data = await createCafePets(
        formValues,
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
          description: "Pet created.",
        });
        router.push("/admin/pet-cafe/pets");
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
        <Heading title="Create Pet" />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5 px-2"
        >
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
              {rooms?.map((room, i) => (
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
                            <Label htmlFor={option} className="cursor-pointer">
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

          <div className="grid grid-cols-2 gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Enter pet's vaccination"
              control={form.control}
              name="vaccinationRecords"
              label="Vaccination Records"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Enter pet's medication"
              control={form.control}
              name="medication"
              label="Medication"
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

          <div className="flex mt-10 items-center justify-end space-x-4">
            <div className="flex items-center justify-end space-x-4">
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
    </>
  );
}
