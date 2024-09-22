"use client";

import { useState } from "react";
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
  FileText,
  Mail,
  MessageCircle,
  PawPrint,
  PawPrintIcon,
  Phone,
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
  submitAppointment,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
];

const options = [
  { value: "choose", description: "Choose Pet Clinic and Doctor" },
  { value: "recommend", description: "Recommend Pet Clinic and Doctor" },
];

const petSchema = z.object({
  petOptions: z.enum(["new", "other"]).optional(),
  name: z.string().min(2, {
    message: "Pet name must be at least 2 characters.",
  }),
  petType: z.string().min(2, {
    message: "Pet type must be at least 2 characters.",
  }),
  age: z.number().min(0, "Year must be at least 0"),
  month: z
    .number()
    .min(1, "Month must be at least 1")
    .max(12, "Month must not be greater than 12."),
  sex: z.enum(["male", "female", "other"]),
  breed: z.string().optional(),
  vaccinationRecords: z.any().optional(),
  imageUrl: z.any().optional(),
});

const appointmentSchema = z.object({
  option: z.enum(["choose", "recommend"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "A time slot is required.",
  }),
  doctorId: z.string().optional(),
  clinicId: z.string().optional(),
});

const formSchema = z.object({
  petOptions: z.enum(["new", "other"]).optional(),
  name: z.string().min(2, {
    message: "Pet name must be at least 2 characters.",
  }),
  petType: z.string().min(2, {
    message: "Pet type must be at least 2 characters.",
  }),
  age: z.number().min(0, "Year must be at least 0"),
  month: z
    .number()
    .min(1, "Month must be at least 1")
    .max(12, "Month must not be greater than 12."),
  sex: z.enum(["male", "female", "other"]),
  breed: z.string().optional(),
  vaccinationRecords: z.any().optional(),
  imageUrl: z.any().optional(),
  option: z.enum(["choose", "recommend"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "A time slot is required.",
  }),
  doctorId: z.string().optional(),
  clinicId: z.string().optional(),
});

const generateAppointmentID = (): string => {
  const timestampPart = Math.floor(100000 + Math.random() * 900000).toString();
  return `CLAPT#${timestampPart}`;
};

const steps = [
  { id: "PetInfo", label: "Pet Information" },
  { id: "AppointmentInfo", label: "Appointment Information" },
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

export default function AppointmentPage({
  doctorsData,
  petClinicsData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [currentStep, setCurrentStep] = useState(0);
  const [time, setTime] = useState<string>();
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData.doctors);
  const [timeSlots, setTimeSlots] = useState<string[]>(defaultTimeSlots);
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");

  const petForm = useForm<z.infer<typeof petSchema>>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      age: 0,
      month: 1,
      sex: "male",
    },
  });

  const appointmentForm = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      option: "recommend",
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formValues: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const {
        name,
        option,
        petType,
        age,
        month,
        sex,
        description,
        date,
        time,
      } = formValues;

      const formData = {
        appointmentId,
        petData: {
          option: "new",
          name,
          petType,
          age,
          month,
          sex,
        },
        appointmentData: {
          option,
          description,
          date: format(date, "yyyy-MM-dd"),
          time,
        },
      };

      const data = await submitAppointment(
        formData,
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
          description: `${data.message}`,
        });
        router.push("/");
      }
    } finally {
      setLoading(false);
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
    appointmentForm.setValue("date", undefined as any);
    appointmentForm.setValue("doctorId", doctorId);
    setTimeSlots([]);
  };

  const handleSelectDate = async (date: Date | undefined) => {
    if (date) {
      const doctorId = form.getValues("doctorId");
      if (doctorId) {
        setLoading(true);
        try {
          const fetchedTimeSlots = await fetchAppointmentSlots(
            {
              doctorId,
              date: date.toISOString(),
            },
            auth?.accessToken as string
          );
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
    appointmentForm.setValue("date", date as Date);
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      const isValid = await petForm.trigger();
      if (isValid) {
        const petData = petForm.getValues();
        form.reset({ ...form.getValues(), ...petData });
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 1) {
      const isValid = await appointmentForm.trigger();
      if (isValid) {
        const appointmentData = appointmentForm.getValues();
        form.reset({ ...form.getValues(), ...appointmentData });
        setAppointmentId(generateAppointmentID());
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
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

      <div className="flex flex-col justify-between gap-5">
        {currentStep === 0 && (
          <Form {...petForm}>
            <form onSubmit={petForm.handleSubmit(handleNextStep)}>
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
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={petForm.control}
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
                      control={petForm.control}
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

                  <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={petForm.control}
                      name="name"
                      placeholder="Pet's Name"
                      label="Enter Your Pet Name"
                      required={true}
                    />

                    <CustomFormField
                      fieldType={FormFieldType.SKELETON}
                      control={petForm.control}
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
                    <FormField
                      control={petForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Enter Age (Year){" "}
                            <span className="text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Pet's Age"
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

                    <FormField
                      control={petForm.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Enter Age (Months){" "}
                            <span className="text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Pet's Age"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              min={1}
                              max={12}
                            />
                          </FormControl>
                          <FormMessage className="shad-error" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                      fieldType={FormFieldType.IMAGE}
                      control={petForm.control}
                      name="vaccinationRecords"
                      label="Vaccination Records"
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}

        {currentStep === 1 && (
          <Form {...appointmentForm}>
            <form onSubmit={appointmentForm.handleSubmit(handleNextStep)}>
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
                      control={appointmentForm.control}
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

                  {appointmentForm.watch("option") === "choose" && (
                    <div className="flex flex-col gap-6 xl:flex-row">
                      <FormField
                        control={appointmentForm.control}
                        name="clinicId"
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
                        control={appointmentForm.control}
                        name="doctorId"
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
                                    <SelectValue
                                      placeholder={"Select Doctors"}
                                    />
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
                      control={appointmentForm.control}
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
                      control={appointmentForm.control}
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
                      control={appointmentForm.control}
                      name="description"
                      label="Initial symptoms / Services requiring an appointment"
                      placeholder="Additional note about your pet"
                      required={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}

        {currentStep === 2 && (
          <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className="text-2xl font-bold">Confirm Appointment</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {appointmentId}
                </span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Date</h4>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <p className="text-sm text-muted-foreground">
                        {form.getValues("date")
                          ? format(form.getValues("date"), "EEEE, dd MMMM")
                          : ""}
                        {", "}
                        {form.getValues("time")} - {form.getValues("time")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Appointment Type</h4>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {form.getValues("option") === "recommend"
                          ? "Recommend me a doctor"
                          : "Choose Pet Clinic and Doctor"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="gap-4">
                  <h4 className="font-semibold mb-2">
                    Initial symptoms / Services requiring an appointment
                  </h4>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm text-muted-foreground">
                      {form.getValues("description")}
                    </span>
                  </div>
                </div>

                {form.getValues("option") === "choose" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Pet Clinic</h4>
                      <div className="flex items-center space-x-2">
                        <PawPrint className="h-4 w-4" />
                        <p className="text-sm text-muted-foreground">
                          {form.getValues("clinicId")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Doctor</h4>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {form.getValues("doctorId")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-full md:w-1/3 flex justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={auth?.user.profileUrl || ""}
                          alt={auth?.user.name}
                        />
                        <AvatarFallback>
                          {auth?.user.name ? auth.user.name[0] : ""}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col gap-2">
                      <h3 className="text-lg font-semibold">
                        {auth?.user.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{auth?.user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{auth?.user.email}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Preferred Pharmachy
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Badge variant="secondary">Cataflam 50 mg</Badge>
                          <Badge variant="secondary">Ponstan 500 mg</Badge>
                          <Badge variant="secondary">Mefinal 500 mg</Badge>
                          <Badge variant="secondary">Ibuprofen 400 mg</Badge>
                        </div>
                      </div>
                    </div> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pet Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Name</h4>
                      <div className="flex items-center space-x-2">
                        <PawPrint className="h-4 w-4" />
                        <p className="text-sm text-muted-foreground">
                          {form.getValues("name")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Pet Type & Breed</h4>
                      <div className="flex items-center space-x-2">
                        <PawPrintIcon className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {form.getValues("petType")} /{" "}
                          {form.getValues("breed")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Age</h4>
                      <div className="flex items-center space-x-2">
                        <PawPrint className="w-4 h-4" />
                        <span className="text-sm text-muted-foreground">
                          <span>
                            {form.getValues("age")} years{" "}
                            {form.getValues("month")} months
                          </span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sex</h4>
                      <p className="text-sm text-muted-foreground">
                        {form.getValues("sex")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          ) : (
            <Button type="button" onClick={handleNextStep}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
