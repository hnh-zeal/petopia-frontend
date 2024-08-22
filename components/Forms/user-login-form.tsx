"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { AdminLoginSchema } from "@/validations/formValidation";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "../submit-button";
import { userLogin } from "@/pages/api/api";
import { userAuthState } from "@/states/auth";
import { useRecoilState } from "recoil";
import Image from "next/image";
import { Password } from "../password";

type adminLoginValue = z.infer<typeof AdminLoginSchema>;

export default function UserLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auth, setAuth] = useRecoilState(userAuthState);

  const form = useForm<adminLoginValue>({
    resolver: zodResolver(AdminLoginSchema),
  });

  const onSubmit = async (formValues: adminLoginValue) => {
    setIsLoading(true);
    try {
      const data = await userLogin(formValues);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        localStorage.setItem("token", data.accessToken);
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        });
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
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

          <section className="space-y-6">
            <div className="flex flex-row justify-between gap-6 xl:flex-row">
              <div className="flex flex-row gap-3 space-y-3">
                <Checkbox className="mt-3" id="rememberMe" />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button
                variant="ghost"
                type="button"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </Button>
            </div>
          </section>

          <SubmitButton isLoading={isLoading} className="ml-auto w-full">
            Login
          </SubmitButton>
        </form>
      </Form>

      <section className="space-y-3">
        <Separator />
        <Button variant="outline" className=" w-full" onClick={googleSignIn}>
          <Image
            src="/google.png"
            width="20"
            height="20"
            alt="Google"
            className="mr-5"
          />
          <p>Sign in with Google</p>
        </Button>
        <div className="flex flex-row justify-between gap-6 xl:flex-row">
          <div className="flex flex-row">
            <label className="text-sm py-3  font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Don&apos;t have an account yet?
            </label>
            <Button variant="ghost" onClick={() => router.push("/register")}>
              Sign up here
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
