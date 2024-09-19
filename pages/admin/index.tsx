import React from "react";
import Image from "next/image";
import AdminAuthForm from "@/components/Forms/admin-auth-form";
import { Toaster } from "@/components/ui/toaster";

export default function Login() {
  return (
    <div className="flex h-full">
      <section className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 place-items-center gap-5">
        {/* Left Side: Image and Logo */}
        <div className="relative hidden lg:flex h-full flex-col bg-muted text-white dark:border-r">
          <div className="relative w-full h-full">
            <Image
              src="/pet-owner-login.jpg"
              width={750}
              height={750}
              alt="Admin Login"
              className="object-cover h-full w-full"
            />
            {/* <div className="absolute top-0 left-0 m-12 flex items-center space-x-2">
              <Image src="/logo.ico" width={35} height={35} alt="Logo" />
              <p className="text-lg text-black font-medium">Petopia</p>
            </div> */}
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full m-10 flex flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <Image
              src="/logo.ico"
              width={45}
              height={45}
              alt="Logo"
              className="h-12 w-auto mx-auto"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Petopia Management Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Login to Manage Petopia
            </p>
          </div>
          <AdminAuthForm />
        </div>
        <Toaster />
      </section>
    </div>
  );
}
