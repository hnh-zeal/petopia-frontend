import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { VerifyOTPSchema } from "@/validations/formValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifyOTP } from "./api/api";
import { Toaster } from "@/components/ui/toaster";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type VerifyOTPValue = z.infer<typeof VerifyOTPSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      const email = localStorage.getItem("emailForOTP");
      const formData = {
        email,
        ...formValues,
      };
      const data = await verifyOTP(formData);
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
        router.push(`/reset-password`);
      }
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
              Enter OTP to reset password resetting password.
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
                  <Button type="submit" disabled={isLoading}>
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
