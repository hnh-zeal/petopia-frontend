import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { useToast } from "@/components/ui/use-toast";
import { ForgotPasswordSchema } from "@/validations/formValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "./api/api";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ForgotPasswordValue = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordValue>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (formValues: ForgotPasswordValue) => {
    setIsLoading(true);
    try {
      const data = await forgotPassword(formValues);
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
        localStorage.setItem("emailForOTP", formValues.email);
        router.push(`/verify-otp`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-60px)] px-2">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-1/2 my-10 bg-white rounded-lg shadow dark:border sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                Forgot Password
              </h1>
              <p className="text-sm text-muted-foreground ">
                Enter your email to send OTP for resetting password.
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex-1 space-y-12"
                >
                  <section className="space-y-6">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="email"
                      label="Email address"
                      placeholder="user@gmail.com"
                      required={true}
                    />
                  </section>

                  <div className="flex flex-row justify-end space-x-4 w-full">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push("/login");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="shad-primary-btn"
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
                        <>Send Email</>
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
    </ScrollArea>
  );
}
