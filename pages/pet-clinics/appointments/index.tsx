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
} from "@/pages/api/api";
import { Doctor, PetClinic } from "@/constants/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  petName: z.string().min(2, {
    message: "Pet name must be at least 2 characters.",
  }),
  petType: z.string().min(2, {
    message: "Pet type must be at least 2 characters.",
  }),
  option: z.enum(["choose", "recommend"]),
  clinicId: z.string().optional(),
  doctorId: z.string().optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "A time slot is required.",
  }),
  note: z.string().optional(),
});

const steps = [
  { id: "PetInfo", label: "Pet Information" },
  { id: "AppointmentInfo", label: "Appointment Information" },
  { id: "Confirm", label: "Confirm" },
];

const petTypes = [{ name: "Dog" }, { name: "Cat" }];

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

const options = [
  { value: "choose", description: "Choose Pet Clinic and Doctor" },
  { value: "recommend", description: "Recommend Pet Clinic and Doctor" },
];

export default function BookAppointment({
  doctorsData,
  petClinicsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [time, setTime] = useState<string>();
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData.doctors);
  const [timeSlots, setTimeSlots] = useState<string[]>(defaultTimeSlots);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: "",
      petType: "",
      option: "choose",
      note: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
    }
  };

  const handleClinicChange = (clinicId: string) => {
    const filteredDoctors = doctorsData.doctors.filter(
      (doctor: Doctor) => doctor.clinic.id === parseInt(clinicId)
    );
    form.setValue("clinicId", clinicId);
    setDoctors(filteredDoctors);
    setTimeSlots(defaultTimeSlots);
  };

  const handleDoctorChange = (doctorId: string) => {
    form.setValue("doctorId", doctorId);
    form.setValue("date", undefined as any);
    setTimeSlots([]);
  };

  const handleSelectDate = async (date: Date | undefined) => {
    if (date) {
      const doctorId = form.getValues("doctorId");
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
              <CardContent>
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="petName"
                    placeholder="Pet's Name"
                    label="Enter Your Pet Name"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="petType"
                    label="Pet Type"
                    placeholder="Select Pet Type"
                  >
                    {petTypes.map((pet, i) => (
                      <SelectItem key={pet.name + i} value={pet.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <p>{pet.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </CustomFormField>
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
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="option"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <div className="flex flex-col justify-between xl:flex-row gap-6">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6"
                          >
                            {options.map((option, i) => (
                              <div
                                key={option.value + i}
                                className="flex items-center space-x-3"
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                />
                                <Label
                                  htmlFor={option.value}
                                  className="cursor-pointer text-gray-700"
                                >
                                  {option.description}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </FormControl>
                    )}
                  />
                </div>

                {form.watch("option") === "choose" && (
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <FormField
                      control={form.control}
                      name={"clinicId"}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Pet Clinic
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={handleClinicChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="shad-select-trigger">
                                  <SelectValue
                                    placeholder={"Select Pet Clinic"}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="shad-select-content">
                                {petClinicsData.clinics.map(
                                  (clinic: PetClinic, i: number) => (
                                    <SelectItem
                                      key={clinic.id}
                                      value={`${clinic.id}`}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{clinic.name}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="shad-error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"clinicId"}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Doctors
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={handleDoctorChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="shad-select-trigger">
                                  <SelectValue placeholder={"Select Doctors"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="shad-select-content">
                                {doctors.map((doctor: any, i: number) => (
                                  <SelectItem
                                    key={doctor.id}
                                    value={`${doctor.id}`}
                                  >
                                    <div className="flex cursor-pointer items-center gap-2">
                                      <p>{doctor.name}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="shad-error" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

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
                    name="note"
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
                    <strong>Pet Name:</strong> {form.getValues("petName")}
                  </p>
                  <p>
                    <strong>Pet Type:</strong> {form.getValues("petType")}
                  </p>
                  <p>
                    <strong>Center:</strong> {form.getValues("clinicId")}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {form.getValues("doctorId")}
                  </p>
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
                    <strong>Note:</strong> {form.getValues("note")}
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
