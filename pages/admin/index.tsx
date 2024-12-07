import React from "react";
import Image from "next/image";
import AdminAuthForm from "@/components/Forms/admin-auth-form";
import { Toaster } from "@/components/ui/toaster";

export default function Login() {
  return (
    <div className="flex h-screen">
      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
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
      </div>

      {/* Left Image Section */}
      <div className="flex-1 bg-blue-500 flex items-center justify-center relative">
        <Image src="/login.jpg" alt="Login" fill />
      </div>

      <Toaster />
    </div>
  );
}
