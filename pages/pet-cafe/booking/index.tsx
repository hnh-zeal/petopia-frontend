"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { DoctorData, PetClinicData } from "@/types/api";
import {
  fetchAppointmentSlots,
  fetchDoctors,
  fetchPetClinics,
  submitBooking,
} from "@/pages/api/api";
import { Doctor, GenderOptions, PetClinic, petTypes } from "@/constants/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { userAuthState } from "@/states/auth";
import { useRecoilValue } from "recoil";

const formSchema = z.object({
  roomId: z.number(),
  date: z.date(),
  time: z.string(),
});

const steps = [
  { id: "RoomInfo", label: "Room Selection" },
  { id: "UserInfo", label: "Booking Information" },
  { id: "Confirm", label: "Confirm" },
];

export const getStaticProps = (async (context) => {
  const doctorsData = await fetchDoctors();
  const petClinicsData = await fetchPetClinics();
  return { props: { doctorsData, petClinicsData } };
}) satisfies GetStaticProps<{
  doctorsData: DoctorData;
  petClinicsData: PetClinicData;
}>;

const defaultTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
];

export default function BookAppointment({
  doctorsData,
  petClinicsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [time, setTime] = useState<string>();
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData.doctors);
  const [timeSlots, setTimeSlots] = useState<string[]>(defaultTimeSlots);
  const [loading, setLoading] = useState(false);
  const auth = useRecoilValue(userAuthState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formValues: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const data = await submitBooking(formValues, auth?.accessToken as string);
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
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDate = async (date: Date | undefined) => {
    if (date) {
      const doctorId = form.getValues("roomId");
      if (doctorId) {
        setLoading(true);
        try {
          const fetchedTimeSlots = await fetchAppointmentSlots({
            doctorId,
            date,
          });
          const formattedTimeSlots = fetchedTimeSlots.slots.map((slot: any) =>
            format(new Date(slot.startTime), "h:mm a")
          );
          setTimeSlots(formattedTimeSlots);
        } catch (error) {
          console.error("Error fetching time slots:", error);
          setTimeSlots([]);
        } finally {
          setLoading(false);
        }
      }
    } else {
      setTimeSlots(defaultTimeSlots);
    }
    form.setValue("date", date as Date);
  };

  useEffect(() => {
    if (!auth) {
      router.push("/register");
    }
  }, [auth, router]);

  if (!auth) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Appointment Form</h1>

      <div className="flex justify-between items-center mb-8 space-x-4 mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-semibold",
                currentStep >= index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              )}
            >
              {index + 1}
            </div>
            <div className="ml-2 text-lg">{step.label}</div>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-5"
        >
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">
                  Pet Information
                </CardTitle>
                <CardDescription>
                  Fill out your pet information.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-6">
                {/* Pet Type and Breed */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="petType"
                    label="Pet Type"
                    placeholder="Select Pet Type"
                    required={true}
                  >
                    {petTypes.map((pet, i) => (
                      <SelectItem key={pet.name + i} value={pet.name}>
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
                    {petTypes.map((pet, i) => (
                      <SelectItem key={pet.name + i} value={pet.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <p>{pet.label}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>

                {/* Pet Name and Sex */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    placeholder="Pet's Name"
                    label="Enter Your Pet Name"
                    required={true}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="sex"
                    label="Sex"
                    required={true}
                    renderSkeleton={(field) => (
                      <FormControl>
                        <RadioGroup
                          className="flex h-11 gap-6 xl:justify-between"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {GenderOptions.map((option, i) => {
                            const capitalizedOption =
                              option.charAt(0).toUpperCase() +
                              option.slice(1).toLowerCase();

                            return (
                              <div key={i} className="radio-group">
                                <div className="flex flex-row space-x-2 items-center mt-3">
                                  <RadioGroupItem
                                    value={option}
                                    id={capitalizedOption}
                                  />
                                  <Label
                                    htmlFor={capitalizedOption}
                                    className="cursor-pointer"
                                  >
                                    {capitalizedOption}
                                  </Label>
                                </div>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.IMAGE}
                    control={form.control}
                    name="vaccinationRecords"
                    label="Vaccination Records"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">
                  Appointment Information
                </CardTitle>
                <CardDescription>
                  Fill out appointment information.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col space-y-6">
                <div className="flex flex-col gap-6 xl:flex-row"></div>

                <div className="grid grid-cols-2 place-content-center gap-6 xl:flex-row">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-700 flex flex-row items-center gap-3">
                          <CalendarIcon />
                          Select Date
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={handleSelectDate}
                              disabled={(date) =>
                                date < new Date() ||
                                date >
                                  new Date(
                                    new Date().setMonth(
                                      new Date().getMonth() + 2
                                    )
                                  )
                              }
                              className="rounded-lg overflow-hidden"
                              initialFocus
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex flex-row items-center gap-3 text-gray-700">
                          <Clock />
                          <p>Select Time</p>
                        </FormLabel>
                        <div className="mt-3">
                          <FormControl>
                            <div className="grid grid-cols-3 gap-2 p-4">
                              {timeSlots.map((slot) => (
                                <h2
                                  key={slot}
                                  onClick={() => {
                                    setTime(slot);
                                    field.onChange(slot);
                                  }}
                                  className={`p-2 border hover:bg-red-200 border-gray-300 rounded-3xl text-center cursor-pointer 
                                  ${slot === time && "bg-red-200"}`}
                                >
                                  {slot}
                                </h2>
                              ))}
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="description"
                    label="Initial symptoms / Services requiring an appointment"
                    placeholder="Additional note about your pet"
                    required={true}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-4">
                  Confirm Appointment
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Date:</strong>{" "}
                    {form.getValues("date")
                      ? format(form.getValues("date"), "PPP")
                      : ""}
                  </p>
                  <p>
                    <strong>Time:</strong> {form.getValues("time")}
                  </p>
                  <p>
                    <strong>
                      Initial symptoms / Services requiring an appointment:
                    </strong>{" "}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            ) : (
              <div className="w-16"></div>
            )}

            {currentStep === steps.length - 1 ? (
              <Button type="submit">Confirm</Button>
            ) : (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
