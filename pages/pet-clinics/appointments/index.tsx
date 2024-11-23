"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { GetServerSideProps } from "next";
import { DoctorData, PetClinicData, User } from "@/types/api";
import {
  fetchAppointmentSlots,
  fetchDoctors,
  fetchPetClinics,
  fetchUserWithToken,
  submitAppointment,
} from "@/pages/api/api";
import { userAuthState } from "@/states/auth";
import { useRecoilValue } from "recoil";
import { PetForm } from "@/components/Layout/Pet Clinic/PetForm";
import { AppointmentForm } from "@/components/Layout/Pet Clinic/AppointmentForm";
import { toast } from "@/components/ui/use-toast";
import { ConfirmationForm } from "@/components/Layout/Pet Clinic/ConfirmationForm";

const petSchema = z.object({
  name: z.string().optional(),
  petId: z.string().optional(),
  petType: z.string(),
  age: z.number().min(0, "Year must be at least 0").optional(),
  month: z
    .number()
    .min(1, "Month must be at least 1")
    .max(12, "Month must not be greater than 12.")
    .optional(),
  sex: z.string().optional(),
  breed: z.string().optional(),
  vaccinationRecords: z.any().optional(),
  imageUrl: z.any().optional(),
});

const appointmentSchema = z.object({
  option: z.enum(["choose", "recommend"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  date: z.date({ required_error: "A date is required." }),
  time: z.string({ required_error: "A time slot is required." }),
  doctorId: z.string().optional(),
  clinicId: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().optional(),
  petId: z.string().optional(),
  petType: z.string().optional(),
  age: z.number().min(0, "Year must be at least 0").optional(),
  month: z
    .number()
    .min(1, "Month must be at least 1")
    .max(12, "Month must not be greater than 12.")
    .optional(),
  sex: z.string().optional(),
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
  return `CLINIC#${timestampPart}`;
};

const steps = [
  { id: "PetInfo", label: "Pet Information" },
  { id: "AppointmentInfo", label: "Appointment Information" },
  { id: "Confirm", label: "Confirm" },
];

export const getServerSideProps: GetServerSideProps<{
  doctorsData: DoctorData;
  petClinicsData: PetClinicData;
}> = async (context) => {
  try {
    const doctorsData = await fetchDoctors({});
    const petClinicsData = await fetchPetClinics({});
    return { props: { doctorsData, petClinicsData } };
  } catch (error) {
    console.error("Error fetching pet clinic:", error);
    return {
      notFound: true,
    };
  }
};

export default function ClinicAppointmentPage({
  doctorsData,
  petClinicsData,
}: {
  doctorsData: DoctorData;
  petClinicsData: PetClinicData;
}) {
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [user, setUser] = useState<User | any>();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const petForm = useForm<z.infer<typeof petSchema>>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      age: 0,
      month: 1,
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

  useEffect(() => {
    const fetchUser = async () => {
      if (auth) {
        const user = await fetchUserWithToken(auth?.accessToken as string);
        setUser(user);
      }
      setMounted(true);
    };

    fetchUser();
  }, [auth]);

  if (!mounted) {
    return null;
  }

  const onSubmit = async (formValues: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const {
        name,
        petId,
        petType,
        option,
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
          option: petId ? "existing" : "new",
          petId,
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
          <PetForm form={petForm} user={user} onSubmit={handleNextStep} />
        )}

        {currentStep === 1 && (
          <AppointmentForm
            form={appointmentForm}
            doctorsData={doctorsData}
            petClinicsData={petClinicsData}
            onSubmit={handleNextStep}
            fetchAppointmentSlots={fetchAppointmentSlots}
            auth={auth}
          />
        )}

        {currentStep === 2 && (
          <ConfirmationForm
            form={form}
            appointmentId={appointmentId}
            user={user}
          />
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
            <Button
              type="button"
              className="bg-[#00b2d8] hover:bg-[#2cc4e6]"
              onClick={handleNextStep}
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
