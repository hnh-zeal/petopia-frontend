"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreateDoctorSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { useEffect, useState } from "react";
import { PetClinic } from "@/constants/data";
import { CirclePlus, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { motion } from "framer-motion";
import { fetchPetClinics } from "@/pages/api/api";
import { daysOfWeek } from "@/constants/data";

const steps = [
  { id: "Step 1", name: "Personal Information" },
  { id: "Step 2", name: "Qualifications" },
  { id: "Step 3", name: "Preview" },
];

type DoctorFormValue = z.infer<typeof CreateDoctorSchema>;

export default function CreateDoctorForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [petClinicsData, setPetClinicsData] = useState({
    clinics: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const router = useRouter();
  const form = useForm<DoctorFormValue>({
    resolver: zodResolver(CreateDoctorSchema),
  });

  const { handleSubmit, reset } = useForm<DoctorFormValue>({
    resolver: zodResolver(CreateDoctorSchema),
  });

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const [experiences, setExperiences] = useState([
    { from_year: "", to_year: "", position: "", location: "" },
  ]);
  const [educations, setEducations] = useState([
    { year: "", name: "", location: "" },
  ]);
  const [schedule, setSchedule] = useState([
    { dayOfWeek: "", startTime: "", endTime: "" },
  ]);

  const processForm: SubmitHandler<DoctorFormValue> = (data) => {
    console.log(data);
    reset();
  };

  const next = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { from_year: "", to_year: "", position: "", location: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducations([...educations, { year: "", name: "", location: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const addSchedule = () => {
    setSchedule([...schedule, { dayOfWeek: "", startTime: "", endTime: "" }]);
  };

  const removeSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const getPetClinics = async () => {
      setLoading(true);
      try {
        const data = await fetchPetClinics();
        setPetClinicsData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Centers", error);
      } finally {
        setLoading(false);
      }
    };

    getPetClinics();
  }, []);

  const onSubmit = async (formValues: DoctorFormValue) => {
    setLoading(true);
    try {
      // const schedule =
      const formData = {
        // schedule: {}
        ...formValues,
        ...{ clinicId: Number(formValues.clinicId) },
      };

      console.log(formData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Doctor created.",
        });
        router.push("/admin/doctors");
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
        <Heading title="Create Doctor" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] px-4">
        {/* steps */}
        <nav aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.name} className="md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-sky-600 transition-colors ">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-sky-600">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 0 && (
              <motion.div
                className="w-full space-y-5 px-2 my-10"
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Name and Email */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    placeholder="Enter doctor's name"
                    control={form.control}
                    name="name"
                    label="Name"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.EMAIL}
                    placeholder="Enter doctor's email"
                    control={form.control}
                    name="email"
                    label="Email"
                  />
                </div>

                {/* Pet Center and Phone Number */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="clinicId"
                    label="Pet Center"
                    placeholder="Select Pet Center"
                  >
                    {petClinicsData.clinics.map((center: PetClinic, i) => (
                      <SelectItem key={center.name + i} value={`${center.id}`}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <p>{center.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </CustomFormField>

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    placeholder="Phone Number"
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                  />
                </div>

                {/* About */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    placeholder="About"
                    control={form.control}
                    name="about"
                    label="About"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                className="w-full space-y-5 px-2 my-10"
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {/* Work Experiences */}
                <div className="flex flex-col gap-6">
                  <div className="flex md:flex-row xl:flex-row gap-6 justify-between items-center mx-3">
                    <h3 className="font-bold">Work Experiences</h3>
                    <CirclePlus
                      type="button"
                      className="h-5 w-5 hover:cursor-pointer"
                      onClick={addExperience}
                    />
                  </div>
                  {experiences.map((_, index) => (
                    <Card key={index} className="flex flex-col gap-6 p-5">
                      <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                        <Controller
                          control={form.control}
                          name={`work_experiences.${index}.from_year`}
                          render={({ field }) => (
                            <CustomFormField
                              fieldType={FormFieldType.INPUT}
                              control={form.control}
                              placeholder="From Year"
                              label="From Year"
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={form.control}
                          name={`work_experiences.${index}.to_year`}
                          render={({ field }) => (
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.INPUT}
                              placeholder="To Year"
                              label="To Year"
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={form.control}
                          name={`work_experiences.${index}.position`}
                          render={({ field }) => (
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.INPUT}
                              placeholder="Position"
                              label="Position"
                              {...field}
                            />
                          )}
                        />

                        {experiences.length > 1 && (
                          <Trash2
                            type="button"
                            className="h-5 w-5 mt-7 hover:cursor-pointer"
                            onClick={() => removeExperience(index)}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-6">
                        <Controller
                          control={form.control}
                          name={`work_experiences.${index}.location`}
                          render={({ field }) => (
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.TEXTAREA}
                              placeholder="Location"
                              label="Location"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Education */}
                <div className="flex flex-col gap-6">
                  <div className="flex md:flex-row xl:flex-row gap-6 justify-between items-center mx-3">
                    <h3 className="font-bold">Education</h3>
                    <CirclePlus
                      type="button"
                      className="h-5 w-5 hover:cursor-pointer"
                      onClick={addEducation}
                    />
                  </div>
                  {educations.map((_, index) => (
                    <Card key={index} className="flex flex-col gap-6 p-5">
                      <div className="flex md:flex-row xl:flex-row gap-6 items-center">
                        <Controller
                          control={form.control}
                          name={`education.${index}.year`}
                          render={({ field }) => (
                            <CustomFormField
                              fieldType={FormFieldType.INPUT}
                              control={form.control}
                              placeholder="Year"
                              label="Year"
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={form.control}
                          name={`education.${index}.name`}
                          render={({ field }) => (
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.INPUT}
                              placeholder="Name"
                              label="Name"
                              {...field}
                            />
                          )}
                        />

                        {educations.length > 1 && (
                          <Trash2
                            type="button"
                            className="h-5 w-5 mt-7 hover:cursor-pointer"
                            onClick={() => removeEducation(index)}
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-6">
                        <Controller
                          control={form.control}
                          name={`education.${index}.location`}
                          render={({ field }) => (
                            <CustomFormField
                              control={form.control}
                              fieldType={FormFieldType.TEXTAREA}
                              placeholder="Location"
                              label="Location"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                className="w-full space-y-5 px-2 my-10"
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex flex-col gap-6">
                  <Card className="flex flex-col gap-6 p-5">
                    <div className="flex md:flex-row xl:flex-row gap-6 justify-between items-center ">
                      <h3 className="font-bold">Add Schedule</h3>
                    </div>
                    <div>
                      {schedule.map((_, index) => (
                        <div
                          key={index}
                          className="flex md:flex-row xl:flex-row gap-6 space-y-5 items-center"
                        >
                          <Controller
                            control={form.control}
                            name={`schedule.${index}.dayOfWeek`}
                            render={({ field }) => (
                              <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                placeholder="Choose days of week"
                                label="Days of week"
                                {...field}
                              >
                                {daysOfWeek.map((day, i) => (
                                  <SelectItem key={day + i} value={day}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                      <p>{day}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </CustomFormField>
                            )}
                          />

                          <Controller
                            control={form.control}
                            name={`schedule.${index}.startTime`}
                            render={({ field }) => (
                              <CustomFormField
                                control={form.control}
                                fieldType={FormFieldType.TIME}
                                placeholder="Start Time"
                                label="Start Time"
                                {...field}
                              />
                            )}
                          />

                          <Controller
                            control={form.control}
                            name={`schedule.${index}.endTime`}
                            render={({ field }) => (
                              <CustomFormField
                                control={form.control}
                                fieldType={FormFieldType.TIME}
                                placeholder="End Time"
                                label="End Time"
                                {...field}
                              />
                            )}
                          />

                          {schedule.length > 1 && (
                            <Trash2
                              type="button"
                              className="h-5 w-5 hover:cursor-pointer"
                              onClick={() => removeSchedule(index)}
                            />
                          )}
                          <CirclePlus
                            type="button"
                            className="h-5 w-5 hover:cursor-pointer"
                            onClick={addSchedule}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="mt-8 pt-5">
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prev}
                  disabled={currentStep === 0}
                  className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </Button>

                {currentStep !== 2 && (
                  <Button
                    type="button"
                    onClick={next}
                    disabled={currentStep === steps.length - 1}
                    className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Button>
                )}

                {/* Create Button */}
                {currentStep === 2 && (
                  <div className="flex mt-10 items-center justify-between space-x-4">
                    <div></div>
                    <div className="flex items-center justify-between space-x-4">
                      <Button
                        disabled={loading}
                        variant="outline"
                        className="ml-auto w-full"
                        onClick={onReset}
                      >
                        Reset
                      </Button>
                      <SubmitButton
                        isLoading={loading}
                        className="ml-auto w-full"
                      >
                        Create
                      </SubmitButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </>
  );
}
