import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { VerifyOTPSchema } from "@/validations/formValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userRegister, verifyOTP } from "./api/api";
import { Toaster } from "@/components/ui/toaster";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { userAuthState } from "@/states/auth";

type VerifyOTPValue = z.infer<typeof VerifyOTPSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useRecoilState(userAuthState);

  const form = useForm<VerifyOTPValue>({
    resolver: zodResolver(VerifyOTPSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const handleOTPInput = (event: any) => {
    const otpValue = event.target.value;
    form.setValue("otpCode", otpValue);
  };

  const onSubmit = async (formValues: VerifyOTPValue) => {
    setIsLoading(true);
    try {
      const storedValues = localStorage.getItem("registerValues");
      if (!storedValues) {
        toast({
          variant: "destructive",
          description: "Registration values not found. Please register again.",
        });
        return;
      }

      const registerValues = JSON.parse(storedValues);

      const formData = {
        email: registerValues.email,
        ...formValues,
      };

      const otpVerificationResponse = await verifyOTP(formData);
      if (otpVerificationResponse.error) {
        toast({
          variant: "destructive",
          description: `${otpVerificationResponse.message}`,
        });
      } else {
        const registrationResponse = await userRegister(registerValues);
        if (registrationResponse.error) {
          toast({
            variant: "destructive",
            description: `${registrationResponse.message}`,
          });
        } else {
          toast({
            variant: "success",
            description: "Registration successful!",
          });

          // Clean up and set authentication state
          localStorage.removeItem("registerValues");
          localStorage.setItem("token", registrationResponse.accessToken);
          setAuth(registrationResponse);
          router.push("/");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-1/2 my-10 bg-white rounded-lg shadow dark:border sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify OTP
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter OTP to continue registration.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-center space-y-12"
              >
                <section className="space-y-6 w-full flex justify-center">
                  <InputOTP
                    maxLength={6}
                    onInput={(value) => handleOTPInput(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-14" />
                      <InputOTPSlot index={1} className="h-14 w-14" />
                      <InputOTPSlot index={2} className="h-14 w-14" />
                      <InputOTPSlot index={3} className="h-14 w-14" />
                      <InputOTPSlot index={4} className="h-14 w-14" />
                      <InputOTPSlot index={5} className="h-14 w-14" />
                    </InputOTPGroup>
                  </InputOTP>
                </section>

                <div className="flex flex-row justify-end space-x-4 w-full">
                  <Button variant="outline" onClick={() => router.back()}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#00b2d8]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-4">
                        <Image
                          src="/assets/icons/loader.svg"
                          alt="loader"
                          width={24}
                          height={24}
                          className="animate-spin"
                        />
                        Loading...
                      </div>
                    ) : (
                      <>Verify OTP</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div>
            <Toaster />
          </div>
        </div>
      </div>
    </section>
  );
}
