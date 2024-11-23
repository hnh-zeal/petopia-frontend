"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants/data";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { motion } from "framer-motion";
import SubmitButton from "../submit-button";
import { UserRegisterSchema } from "@/validations/formValidation";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { userRegister } from "@/pages/api/api";
import { Password } from "../password";

const steps = [
  { id: "Step 1", name: "Personal Information" },
  { id: "Step 2", name: "Pet Information" },
  { id: "Step 3", name: "Preview" },
];

type UserRegisterValue = z.infer<typeof UserRegisterSchema>;

const UserRegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const form = useForm<UserRegisterValue>({
    resolver: zodResolver(UserRegisterSchema),
  });
  const { handleSubmit, reset } = useForm<UserRegisterValue>({
    resolver: zodResolver(UserRegisterSchema),
  });

  const processForm: SubmitHandler<UserRegisterValue> = (data) => {
    reset();
  };

  const onSubmit = async (formValues: UserRegisterValue) => {
    setIsLoading(true);
    try {
      const data = await userRegister(formValues);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        // data => { admin, accessToken }
        localStorage.setItem("token", data.accessToken);
        router.push("/admin/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
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

  return (
    <>
      {/* steps */}
      <nav aria-label="Progress">
        <ol
          role="list"
          className="mt-10 space-y-4 md:flex md:space-x-8 md:space-y-0"
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-12"
        >
          {currentStep === 0 && (
            <motion.div
              className="w-full space-y-5 px-2 my-10"
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <section className="space-y-6">
                <div className="mb-2 space-y-1">
                  <h2 className="font-bold">Personal Information</h2>
                </div>

                {/* NAME & PHONE */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    placeholder="John Doe"
                    label="Enter Your Name"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* EMAIL & PASSWORD */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email address"
                    placeholder="user@gmail.com"
                  />

                  <Password form={form} name="password" label="Password" />
                </div>

                {/* BirthDate & Gender */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="birthDate"
                    label="Date of birth"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="gender"
                    label="Gender"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <RadioGroup
                          className="flex h-11 gap-6 xl:justify-between"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {GenderOptions.map((option, i) => (
                            <div key={option + i} className="radio-group">
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
                    )}
                  />
                </div>

                {/* Address & Occupation */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="14 street, New york, NY - 5101"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="occupation"
                    label="Occupation"
                    placeholder=" Software Engineer"
                  />
                </div>
              </section>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              className="w-full space-y-5 px-2 my-10"
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="font-bold sub-header">Pet Information</h2>
                </div>

                {/* PRIMARY CARE PHYSICIAN */}
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="primaryPhysician"
                  label="Primary care physician"
                  placeholder="Select a physician"
                >
                  {Doctors.map((doctor, i) => (
                    <SelectItem key={doctor.name + i} value={doctor.name}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Image
                          src={doctor.image}
                          width={32}
                          height={32}
                          alt="doctor"
                          className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>

                {/* INSURANCE & POLICY NUMBER */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="insuranceProvider"
                    label="Insurance provider"
                    placeholder="BlueCross BlueShield"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="insurancePolicyNumber"
                    label="Insurance policy number"
                    placeholder="ABC123456789"
                  />
                </div>

                {/* ALLERGY & CURRENT MEDICATIONS */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="allergies"
                    label="Allergies (if any)"
                    placeholder="Peanuts, Penicillin, Pollen"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="currentMedication"
                    label="Current medications"
                    placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                  />
                </div>

                {/* FAMILY MEDICATION & PAST MEDICATIONS */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="familyMedicalHistory"
                    label=" Family medical history (if relevant)"
                    placeholder="Mother had brain cancer, Father has hypertension"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="pastMedicalHistory"
                    label="Past medical history"
                    placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                  />
                </div>
              </section>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              className="w-full space-y-5 px-2 my-10"
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Identification and Verfication</h2>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="identificationType"
                  label="Identification Type"
                  placeholder="Select identification type"
                >
                  {IdentificationTypes.map((type, i) => (
                    <SelectItem key={type + i} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="identificationNumber"
                  label="Identification Number"
                  placeholder="123456789"
                />

                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="identificationDocument"
                  label="Scanned Copy of Identification Document"
                  // renderSkeleton={(field) => (
                  //   <FormControl>
                  //     <FileUploader files={field.value} onChange={field.onChange} />
                  //   </FormControl>
                  // )}
                />
              </section>

              <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header items-start">
                    Consent and Privacy
                  </h2>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="treatmentConsent"
                  label="By signing up, you are creating a Petopia account, and you agree to Petopia's Terms of Use and Privacy Policy."
                />

                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="disclosureConsent"
                  label="I consent to the use and disclosure of my health
            information for treatment purposes."
                />

                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="privacyConsent"
                  label="I acknowledge that I have reviewed and agree to the
            privacy policy"
                />
              </section>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="">
            <div className="flex justify-between">
              <Button
                onClick={prev}
                variant={"outline"}
                disabled={currentStep === 0}
                className="px-2 py-1"
              >
                <ChevronLeft />
              </Button>

              <Button
                onClick={next}
                disabled={currentStep === 2}
                variant={"outline"}
                className="px-2 py-1"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          {currentStep === 2 && (
            <SubmitButton isLoading={isLoading}>
              Submit and Continue
            </SubmitButton>
          )}
        </form>
      </Form>
    </>
  );
};

export default UserRegisterForm;
