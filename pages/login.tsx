import React from "react";
import Image from "next/image";
import UserLoginForm from "@/components/Forms/user-login-form";
import { Toaster } from "@/components/ui/toaster";

export default function Login() {
  return (
    <section className="container h-full w-full grid grid-cols-1 lg:grid-cols-2 place-items-center gap-5">
      <div className="relative hidden flex-col bg-muted text-white lg:flex dark:border-r">
        <div className="relative w-full">
          <Image src="/cat1.jpg" width="800" height="1000" alt="Admin Login" />
        </div>
      </div>

      <div className="h-auto m-10 flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account..
          </p>
        </div>
        <UserLoginForm />
      </div>
      <div>
        <Toaster />
      </div>
    </section>
  );
}
