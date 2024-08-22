import React from "react";
import UserRegisterForm from "@/components/Forms/user-register-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function Register() {
  return (
    <ScrollArea className="h-[calc(100vh-60px)] px-2">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full my-10 bg-white rounded-lg shadow dark:border sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex flex-row justify-center space-x-4">
                <Image
                  src="/mobile-logo.png"
                  width={35}
                  height={35}
                  alt="Logo"
                />{" "}
                <h1 className="text-2xl font-semibold tracking-tight text-center">
                  Start Your Petopia Journey
                </h1>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Sign Up to Enjoy Our Pet Services...
              </p>
              <UserRegisterForm />
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
