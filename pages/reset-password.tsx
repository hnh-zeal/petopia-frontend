import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ChangePasswordSchema } from "@/validations/formValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "./api/api";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Password } from "@/components/password";

type ChangePasswordValue = z.infer<typeof ChangePasswordSchema>;

export default function ChangePassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordValue>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (formValues: ChangePasswordValue) => {
    setIsLoading(true);
    try {
      const email = localStorage.getItem("emailForOTP");
      const formData = {
        email,
        ...formValues,
      };

      const data = await resetPassword(formData);
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
        router.push("/login");
        localStorage.removeItem("emailForOTP");
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
              Change Password
            </h1>
            <p className="text-sm text-muted-foreground ">
              Please fill the form to reset your password
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1 space-y-12"
              >
                <section className="space-y-6">
                  <Password
                    form={form}
                    name="new_password"
                    label="New Password"
                  />
                  <Password
                    form={form}
                    name="confirm_password"
                    label="Confirm Password"
                  />
                </section>

                <div className="flex flex-row justify-end space-x-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/verify-otp");
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
                      <>Change Password</>
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
