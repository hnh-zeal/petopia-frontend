"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  clinicId: z.string().min(1, "Please select a clinic"),
  doctorId: z.string().min(1, "Please select a doctor"),
});

type Clinic = {
  id: string;
  name: string;
};

type Doctor = {
  id: string;
  name: string;
  clinicId: string;
};

const clinics: Clinic[] = [
  { id: "1", name: "Happy Paws Clinic" },
  { id: "2", name: "Furry Friends Hospital" },
  { id: "3", name: "Whiskers & Tails Care" },
];

const doctors: Doctor[] = [
  { id: "1", name: "Dr. Smith", clinicId: "1" },
  { id: "2", name: "Dr. Johnson", clinicId: "1" },
  { id: "3", name: "Dr. Williams", clinicId: "2" },
  { id: "4", name: "Dr. Brown", clinicId: "2" },
  { id: "5", name: "Dr. Davis", clinicId: "3" },
  { id: "6", name: "Dr. Miller", clinicId: "3" },
];

export default function ClinicDoctorSelector() {
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinicId: "",
      doctorId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Handle form submission here
  };

  const handleClinicChange = (clinicId: string) => {
    setSelectedClinic(clinicId);
    form.setValue("clinicId", clinicId);
    form.setValue("doctorId", "");
  };

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.clinicId === selectedClinic
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clinicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Clinic</FormLabel>
              <Select onValueChange={handleClinicChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a clinic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedClinic}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </Form>
  );
}
