"use client";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { AdminLoginSchema } from "@/validations/formValidation";
import { useRecoilState } from "recoil";
import { adminAuthState } from "@/states/auth";
import { adminLogin } from "@/pages/api/api";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { Password } from "../password";

type adminLoginValue = z.infer<typeof AdminLoginSchema>;

export default function AdminAuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auth, setAuth] = useRecoilState(adminAuthState);

  const form = useForm<adminLoginValue>({
    resolver: zodResolver(AdminLoginSchema),
  });

  const onSubmit = async (formValues: adminLoginValue) => {
    setIsLoading(true);
    try {
      const data = await adminLogin(formValues);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        setAuth({
          admin: data.admin,
          accessToken: data.accessToken,
        });
        router.push("/admin/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-5"
        >
          <section className="space-y-6">
            {/* Email & Password */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              required={true}
            />

            <Password form={form} name="password" label="Password" />
          </section>

          <SubmitButton isLoading={isLoading} className="ml-auto w-full">
            Login
          </SubmitButton>
        </form>
      </Form>
    </>
  );
}
