import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  MessageCircle,
  FileText,
  PawPrint,
  Phone,
  Mail,
} from "lucide-react";
import { User } from "@/types/api";

interface ConfirmationFormProps {
  form: UseFormReturn<any>;
  appointmentId: string;
  user: User;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
  form,
  appointmentId,
  user,
}) => {
  const petId = form.getValues("petId");
  const pet = user?.pets?.find((pet) => pet.id === Number(petId));

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h1 className="text-2xl font-bold">Confirm Appointment</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{appointmentId}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Date</h4>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <p className="text-sm text-muted-foreground">
                  {form.getValues("date")
                    ? format(form.getValues("date"), "EEEE, dd MMMM")
                    : ""}
                  {", "}
                  {form.getValues("time")}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Appointment Type</h4>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {form.getValues("option") === "recommend"
                    ? "Recommend me a doctor"
                    : "Choose Pet Clinic and Doctor"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Initial symptoms / Services requiring an appointment
            </h4>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">
                {form.getValues("description")}
              </span>
            </div>
          </div>

          {form.getValues("option") === "choose" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Pet Clinic</h4>
                <div className="flex items-center space-x-2">
                  <PawPrint className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("clinicId")}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Doctor</h4>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {form.getValues("doctorId")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profileUrl || ""} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? user.name[0] : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pet Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Name</h4>
                <div className="flex items-center space-x-2">
                  <PawPrint className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">
                    {pet ? pet.name : form.getValues("name")}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pet Type & Breed</h4>
                <div className="flex items-center space-x-2">
                  <PawPrint className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {pet
                      ? `${pet.petType} / ${pet.breed}`
                      : `${form.getValues("petType")} / ${form.getValues("breed")}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Age</h4>
                <div className="flex items-center space-x-2">
                  <PawPrint className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    {pet
                      ? `${pet.age} years ${pet.month} months`
                      : `${form.getValues("age")} years ${form.getValues("month")} months`}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sex</h4>
                <p className="text-sm text-muted-foreground">
                  {pet ? pet.sex : form.getValues("sex")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
