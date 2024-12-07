import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Clinic } from "@/types/api";

interface AppointmentFormProps {
  form: UseFormReturn<any>;
  doctorsData: any;
  petClinicsData: any;
  onSubmit: () => void;
  fetchAppointmentSlots: (params: any, token: string) => Promise<any>;
  auth: any;
}

const options = [
  { value: "choose", description: "Choose Pet Clinic and Doctor" },
  { value: "recommend", description: "Recommend Pet Clinic and Doctor" },
];

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

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  form,
  doctorsData,
  petClinicsData,
  onSubmit,
  fetchAppointmentSlots,
  auth,
}) => {
  const [doctors, setDoctors] = useState(doctorsData.data);
  const [timeSlots, setTimeSlots] = useState<string[]>(defaultTimeSlots);
  const [loading, setLoading] = useState(false);

  const handleClinicChange = (clinicId: string) => {
    const filteredDoctors = doctorsData.data.filter(
      (doctor: any) => doctor.clinic.id === parseInt(clinicId)
    );
    form.setValue("clinicId", clinicId);
    setDoctors(filteredDoctors);
    setTimeSlots([]);
  };

  const handleDoctorChange = (doctorId: string) => {
    form.setValue("doctorId", doctorId);
    form.setValue("date", undefined);
    setTimeSlots([]);
  };

  const handleSelectDate = async (date: Date | undefined) => {
    form.setValue("date", date as Date);
    form.setValue("time", "");
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
          const formattedTimeSlots = fetchedTimeSlots.slots?.map((slot: any) =>
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">
          Appointment Information
        </CardTitle>
        <CardDescription>Fill out appointment information.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="option"
              renderSkeleton={(field) => (
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
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="cursor-pointer text-gray-700"
                      >
                        {option.description}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />

            {form.watch("option") === "choose" && (
              <div className="flex flex-col gap-6 xl:flex-row mt-6">
                <FormField
                  control={form.control}
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
                              <SelectValue placeholder={"Select Pet Clinic"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="shad-select-content">
                            {petClinicsData?.data?.map(
                              (clinic: Clinic, i: number) => (
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
                              <SelectValue placeholder={"Select Doctors"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="shad-select-content">
                            {doctors?.map((doctor: any, i: number) => (
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

            <div className="grid grid-cols-2 place-content-center gap-6 xl:flex-row mt-6">
              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4" />
                      Select Date
                    </Label>
                    <div className="flex flex-col items-center">
                      <Calendar
                        mode="single"
                        selected={form.watch("date")}
                        onSelect={handleSelectDate}
                        disabled={(date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 2)
                            )
                        }
                      />
                      <FormMessage />
                    </div>
                  </div>
                )}
              />

              {/* Time Slots */}
              <FormField
                name="time"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col gap-3 p-3">
                    <Label className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4" />
                      Select Time
                    </Label>
                    {timeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3 px-5">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={
                              form.watch("time") === slot
                                ? "default"
                                : "outline"
                            }
                            className="rounded-3xl"
                            onClick={() => form.setValue("time", slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No slots available. Please select another date.
                      </p>
                    )}
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <div className="mt-6">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="description"
                label="Initial symptoms / Services requiring an appointment"
                placeholder="Additional note about your pet"
                required={true}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
