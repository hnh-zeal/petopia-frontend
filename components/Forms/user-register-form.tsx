"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GenderOptions } from "@/constants/data";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { UserRegisterSchema } from "@/validations/formValidation";
import { useToast } from "../ui/use-toast";
import { sendEmail } from "@/pages/api/api";
import { Button } from "../ui/button";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Password } from "../password";

type UserRegisterValue = z.infer<typeof UserRegisterSchema>;

const UserRegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserRegisterValue>({
    resolver: zodResolver(UserRegisterSchema),
  });

  const onSubmit = async (formValues: UserRegisterValue) => {
    setIsLoading(true);
    try {
      localStorage.setItem("registerValues", JSON.stringify(formValues));
      const data = await sendEmail({ email: formValues.email });
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
        router.push("/verify-register");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignUp = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-12"
        >
          <section className="space-y-6">
            <div className="mb-2 space-y-1">
              <h2 className="font-bold">Personal Information</h2>
            </div>

            {/* NAME & EMAIL */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                placeholder="John Doe"
                label="Enter Your Name"
                required={true}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="user@gmail.com"
                required={true}
              />
            </div>

            {/* PHONE & PASSWORD */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(555) 123-4567"
              />

              <Password form={form} name="password" label="Password" />
            </div>

            {/* BirthDate & Gender */}
            <div className="flex flex-col gap-6 sm:flex-row">
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

            {/* Address */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="address"
                label="Address"
                placeholder="14 street, New york, NY - 5101"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="font-bold">
                Consent and Privacy <span className="text-red-400">*</span>
              </h2>
            </div>

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="terms"
              label="By signing up, you are creating a Petopia account, and you agree to Petopia's Terms of Use and Privacy Policy."
            />

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="privacy"
              label="I acknowledge that I have reviewed and agree to the
            privacy policy"
            />
          </section>

          <section className="space-y-6">
            <SubmitButton isLoading={isLoading}>
              Submit and Continue
            </SubmitButton>
          </section>

          <div className="space-y-6">
            <Separator />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={googleSignUp}
            >
              <Image
                src="/google.png"
                width="20"
                height="20"
                alt="Google"
                className="mr-5"
              />
              <p>Sign up with Google</p>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserRegisterForm;
