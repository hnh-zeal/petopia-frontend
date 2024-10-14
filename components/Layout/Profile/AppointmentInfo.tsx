"use client";

import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  FileText,
  PawPrint,
  Info,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ClinicAppointment, Doctor } from "@/types/api";
import {
  fetchAppointmentSlots,
  updateClinicAppointment,
} from "@/pages/api/api";
import { toast } from "@/components/ui/use-toast";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDayName } from "./DoctorSchedule";
import { AppointmentSlot } from "@/constants/data";

interface AppointmentDetailsProps {
  appointment: ClinicAppointment;
}

const rejectSchema = z.object({
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters long")
    .max(500, "Reason must not exceed 500 characters"),
});

const approveSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;
type ApproveFormValues = z.infer<typeof approveSchema>;

export default function AppointmentInfo({
  appointment,
}: AppointmentDetailsProps) {
  const auth = useRecoilValue(adminAuthState);

  const [isLoading, setIsLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);

  const rejectForm = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reason: "",
    },
  });

  const approveForm = useForm<ApproveFormValues>({
    resolver: zodResolver(approveSchema),
    defaultValues: {
      doctorId: `${appointment.doctor?.id}`,
    },
  });

  const handleApprove = async (values: ApproveFormValues) => {
    setIsLoading(true);
    try {
      if (values.doctorId === "undefined") {
        throw new Error("Please assign a doctor to approve.");
      }
      const slot = slots.find(
        (slot) => slot.doctor.id === Number(values.doctorId)
      );
      const data = await updateClinicAppointment(
        appointment.id,
        {
          slotId: slot?.id,
          doctorId: values.doctorId,
          status: "ACCEPTED",
        },
        auth?.accessToken as string
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Appointment approved successfully.",
        });
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onApproveClick = () => {
    if (appointment.doctor) {
      handleApprove({ doctorId: appointment.doctor.id.toString() });
    } else {
      approveForm.handleSubmit(handleApprove)();
    }
  };

  const handleReject = async (values: RejectFormValues) => {
    setIsRejectDialogOpen(false);
    setIsLoading(true);
    try {
      const data = await updateClinicAppointment(
        appointment.id,
        {
          status: "REJECTED",
          reason: values.reason,
        },
        auth?.accessToken as string
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Appointment rejected successfully.",
        });
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
      rejectForm.reset();
    }
  };

  const getAppointmentSlots = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAppointmentSlots(
        {
          date: format(new Date(appointment.date), "yyyy-MM-dd"),
          time: format(new Date(appointment.date), "HH:mm:ss"),
          status: true,
        },
        auth?.accessToken as string
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        setSlots(data.slots);
        const doctors = data.slots.map((slot: any) => slot.doctor);
        setDoctors(doctors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setIsRejectDialogOpen(false);
    rejectForm.reset();
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-120px)] px-4">
        <Form {...approveForm}>
          <div className="flex flex-col py-4 gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">
                  Appointment #{appointment.id}
                </h1>
                {appointment.status === "ACCEPTED" ? (
                  <Badge className="bg-green-500">Accepted</Badge>
                ) : appointment.status === "PENDING" ? (
                  <Badge className="bg-orange-500">Pending</Badge>
                ) : appointment.status === "REJECTED" ? (
                  <Badge variant="destructive">Rejected</Badge>
                ) : (
                  <Badge className="bg-gray-500">Cancelled</Badge>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                {appointment.status === "PENDING" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsRejectDialogOpen(true)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                      type="button"
                      onClick={onApproveClick}
                      disabled={
                        isLoading ||
                        (!appointment.doctor && !approveForm.formState.isValid)
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isLoading ? "Approving..." : "Approve"}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Appointment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full flex flex-col gap-4">
                    <div className="flex flex-row items-center">
                      <div className="w-full md:w-1/4 flex-1 flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>Date:</span>
                      </div>
                      <span className="w-full md:w-3/4">
                        {format(new Date(appointment.date), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full md:w-1/4 flex-1 flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span>Time:</span>
                      </div>
                      <span className="w-full md:w-3/4 flex-2">
                        {format(new Date(appointment.date), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-full md:w-1/4 flex-1 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span>Description:</span>
                      </div>
                      <span className="w-full md:w-3/4 flex-2">
                        {appointment.description}
                      </span>
                    </div>
                    {appointment.reason && (
                      <div className="flex items-start">
                        <div className="w-full md:w-1/4 flex-1 flex items-center space-x-2">
                          <Info className="w-5 h-5 text-gray-400" />
                          <span>Reason:</span>
                        </div>
                        <span className="w-full md:w-3/4 flex-2">
                          {appointment.reason}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Pet Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-row items-center space-x-4">
                      <div className="w-full md:w-1/3 flex flex-row justify-center">
                        <Avatar className="w-24 h-24 bg-blue-100">
                          <PawPrint className="w-8 h-8 text-blue-500" />
                        </Avatar>
                      </div>
                      <div className="w-full md:w-2/3 flex flex-col gap-2">
                        <h2 className="text-xl font-semibold">
                          Pet Name: {appointment.pet.name}
                        </h2>
                        <p className="text-sm text-gray-500 capitalize">
                          Pet Type & Breed: {appointment.pet.petType} /{" "}
                          {appointment.pet.breed}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          Age: {appointment.pet.age} year
                          {appointment.pet.age !== 1 ? "s" : ""}{" "}
                          {appointment.pet.month} month
                          {appointment.pet.month !== 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {" "}
                          Sex: {appointment.pet.sex}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {!appointment.doctor ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-row items-center justify-between">
                        <CardTitle>Doctor Information</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={getAppointmentSlots}
                        >
                          See Available doctors for this appointment
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="w-full flex flex-col gap-3">
                          <p className="text-sm text-gray-500">
                            No doctor assigned yet.
                          </p>
                          {slots.length > 0 && (
                            <>
                              <FormField
                                control={approveForm.control}
                                name={"doctorId"}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel className="shad-input-label">
                                      Select Doctor
                                    </FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="shad-select-trigger">
                                            <SelectValue placeholder="Select Doctors" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="shad-select-content">
                                          {doctors.map(
                                            (doctor: any, i: number) => (
                                              <SelectItem
                                                key={doctor.id}
                                                value={`${doctor.id}`}
                                              >
                                                <div className="flex cursor-pointer items-center gap-2">
                                                  <p>{doctor.name}</p>
                                                </div>
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage className="shad-error" />
                                  </FormItem>
                                )}
                              />

                              <h4 className="text-md font-bold">
                                Available Doctor List
                              </h4>
                              <Table className="w-full">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-center">
                                      Doctor
                                    </TableHead>
                                    <TableHead className="text-center">
                                      Clinic
                                    </TableHead>
                                    <TableHead className="text-center">
                                      Specialties
                                    </TableHead>
                                    <TableHead className="text-center">
                                      Day of Week
                                    </TableHead>
                                    <TableHead className="text-center">
                                      Start Time
                                    </TableHead>
                                    <TableHead className="text-center">
                                      End Time
                                    </TableHead>
                                    <TableHead className="text-center">
                                      Status
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {slots?.map(
                                    (slot: AppointmentSlot, index: number) => (
                                      <TableRow
                                        key={index}
                                        className="border-t"
                                      >
                                        <TableCell className="text-center">
                                          {slot.doctor.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {slot.doctor.clinic.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <div className="space-x-1">
                                            {slot.doctor.specialties?.map(
                                              (specialty) => (
                                                <Badge
                                                  key={specialty}
                                                  className="bg-blue-400"
                                                >
                                                  {specialty}
                                                </Badge>
                                              )
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {getDayName(slot.dayOfWeek)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {format(
                                            slot.startTime,
                                            "yyyy-MM-dd h:mm a"
                                          )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {format(
                                            slot.endTime,
                                            "yyyy-MM-dd h:mm a"
                                          )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {slot?.status ? (
                                            <Badge className="bg-green-500">
                                              Available
                                            </Badge>
                                          ) : (
                                            <Badge className="bg-orange-500">
                                              Not Available
                                            </Badge>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        User Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-1/5 flex flex-row justify-center">
                          <Avatar className="w-24 h-24">
                            <AvatarImage
                              src={appointment.user.profileUrl}
                              alt={appointment.user.name}
                            />
                            <AvatarFallback>
                              {appointment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="w-4/5 flex flex-col gap-2">
                          <h2 className="text-xl font-semibold">
                            Name: {appointment.user.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Email: {appointment.user.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Phone: {appointment.user.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            User ID: {appointment.user.id}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-row items-center justify-between">
                        <CardTitle>Doctor Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="w-full md:w-1/3 flex flex-row justify-center">
                          <Avatar className="w-24 h-24">
                            <AvatarImage
                              src={appointment.doctor?.profileUrl}
                              alt={appointment.doctor?.name}
                            />
                            <AvatarFallback>
                              {appointment.doctor?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="w-full md:w-2/3 flex flex-col gap-2">
                          <h3 className="text-lg font-semibold">
                            {appointment.doctor.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Email: {appointment.doctor.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Phone: {appointment.doctor.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            Specialties:{" "}
                            {appointment.doctor.specialties?.join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        User Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-full md:w-1/3 flex flex-row justify-center">
                          <Avatar className="w-24 h-24">
                            <AvatarImage
                              src={appointment.user.profileUrl}
                              alt={appointment.user.name}
                            />
                            <AvatarFallback>
                              {appointment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="w-full md:w-2/3 flex flex-col gap-2">
                          <h2 className="text-xl font-semibold">
                            Name: {appointment.user.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Email: {appointment.user.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Phone: {appointment.user.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            User ID: {appointment.user.id}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </Form>

        <AlertDialog
          open={isRejectDialogOpen}
          onOpenChange={setIsRejectDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this appointment? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...rejectForm}>
              <form
                onSubmit={rejectForm.handleSubmit(handleReject)}
                className="space-y-4"
              >
                <FormField
                  control={rejectForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="reason">Reason for Rejection</Label>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the reason for rejection (minimum 10 characters)"
                          className="mt-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Reject</Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </ScrollArea>
    </>
  );
}
