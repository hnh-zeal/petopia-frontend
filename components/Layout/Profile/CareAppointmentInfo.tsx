import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  PawPrint,
  Stethoscope,
  Package,
  FileText,
  Info,
  XCircle,
  CheckCircle,
  Layers,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CareAppointment } from "@/types/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCareAppointment } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const rejectSchema = z.object({
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters long")
    .max(500, "Reason must not exceed 500 characters"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

const CareAppointmentDetails: React.FC<{ appointment: CareAppointment }> = ({
  appointment,
}) => {
  const auth = useRecoilValue(adminAuthState);
  const [status, setStatus] = useState(appointment.status);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rejectForm = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleApprove = async () => {
    setIsApproveDialogOpen(false);
    setIsLoading(true);
    try {
      const data = await updateCareAppointment(
        appointment.id,
        { status: "ACCEPTED" },
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
        setStatus("ACCEPTED");
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

  const handleReject = async (values: RejectFormValues) => {
    setIsRejectDialogOpen(false);
    setIsLoading(true);
    try {
      const data = await updateCareAppointment(
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
        setStatus("REJECTED");
      }
    } finally {
      setIsLoading(false);
      rejectForm.reset();
    }
  };

  const onCancel = () => {
    setIsRejectDialogOpen(false);
    rejectForm.reset();
  };

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="container m-auto mb-5 p-4 bg-gradient-to-br from-gray-50 to-gray-50 min-h-screen">
        <Card className="px-2 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-4 items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  Appointment Details #{appointment.id}
                </CardTitle>
                <div>
                  {status === "ACCEPTED" ? (
                    <Badge className="bg-green-500">Accepted</Badge>
                  ) : status === "PENDING" ? (
                    <Badge className="bg-orange-500">Pending</Badge>
                  ) : status === "REJECTED" ? (
                    <Badge variant="destructive">Rejected</Badge>
                  ) : (
                    <Badge className="bg-gray-500">Cancelled</Badge>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Submitted on:{" "}
                {format(
                  new Date(appointment.createdAt),
                  "MMMM d, yyyy HH:mm:ss"
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex justify-end space-x-4">
                {status === "PENDING" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsRejectDialogOpen(true)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setIsApproveDialogOpen(true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  Total Price: ${appointment.totalPrice}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold flex items-center">
                  Appointment Information
                </h3>
                <div className="flex flex-row items-center">
                  <div className="w-full md:w-1/4 flex-1 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <p>Date:</p>
                  </div>
                  <span className="w-full md:w-3/4">
                    {format(new Date(appointment.date), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full md:w-1/4 flex-1 flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <p className="text-pretty">Duration:</p>
                  </div>
                  <span className="w-full md:w-3/4 flex-2">
                    {appointment.duration} hours
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-full md:w-1/4 flex-1 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span>Description:</span>
                  </div>
                  <span className="w-full md:w-3/4 flex-2">
                    {appointment.description}
                  </span>
                </div>
                {appointment.reason && (
                  <div className="flex items-start">
                    <div className="w-full md:w-1/4 flex-1 flex items-center space-x-2">
                      <Info className="w-5 h-5 " />
                      <span>Reason:</span>
                    </div>
                    <span className="w-full md:w-3/4 flex-2">
                      {appointment.reason}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-4 mt-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <User className="w-5 h-5 mr-2" /> Pet Sitter
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-1/5 flex flex-row items-center justify-center">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={
                            appointment.petSitter.profileUrl ||
                            `/default-pet-sitter.png`
                          }
                          alt={appointment.petSitter.name}
                        />
                        <AvatarFallback>
                          {appointment.petSitter.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold">
                        {appointment.petSitter.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4 mr-1" />{" "}
                        {appointment.petSitter.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  Service Information
                </h3>
                <div className="flex flex-row items-center">
                  <div className="md:w-2/4 flex-1 flex items-center space-x-2">
                    <Stethoscope className="w-5 h-5" />
                    <p>Service:</p>
                  </div>
                  <span className="w-full md:w-3/4">
                    {appointment.service.name} - {appointment.service.type}
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <div className="md:w-2/4 flex-1 flex items-center space-x-2">
                    <Layers className="w-5 h-5" />
                    <p>Category:</p>
                  </div>
                  <span className="w-full md:w-3/4">
                    {appointment.categoryId.name}
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <div className="md:w-2/4 flex-1 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <p>Base Price:</p>
                  </div>
                  <span className="w-full md:w-3/4">
                    $ {appointment.service.price}
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <div className="md:w-2/4 flex-1 flex items-center space-x-2">
                    <Package className="w-5 h-5 mr-2" />
                    <p>Add-ons</p>
                  </div>
                  <span className="w-full md:w-3/4">
                    <ul className="list-disc list-inside text-sm">
                      {appointment.service.addOns.map((addon) => (
                        <li key={addon.id}>
                          {addon.name} - ${addon.price}
                        </li>
                      ))}
                    </ul>
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" /> Client Information
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-1/5 flex flex-row items-center justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={appointment.user.profileUrl}
                        alt={appointment.user.name}
                      />
                      <AvatarFallback>
                        {appointment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">{appointment.user.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 mr-1" /> {appointment.user.email}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="w-4 h-4 mr-1" />{" "}
                      {appointment.user.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <PawPrint className="w-5 h-5 mr-2" /> Pet Information
                </h3>
                <div className="flex items-center">
                  <div className="w-full md:w-1/5 flex-1 flex items-center space-x-2">
                    <span className="font-semibold">Name:</span>{" "}
                  </div>
                  <span className="w-full md:w-4/5 flex-2">
                    {appointment.pet.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full md:w-1/5 flex-1 flex items-center space-x-2">
                    <span className="font-semibold">Type:</span>{" "}
                  </div>
                  <span className="w-full md:w-4/5 flex-2">
                    {appointment.pet.petType}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full md:w-1/5 flex-1 flex items-center space-x-2">
                    <span className="font-semibold">Breed:</span>{" "}
                  </div>
                  <span className="w-full md:w-4/5 flex-2">
                    {appointment.pet.breed}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full md:w-1/5 flex-1 flex items-center space-x-2">
                    <span className="font-semibold">Sex:</span>{" "}
                  </div>
                  <span className="w-full md:w-4/5 flex-2">
                    {appointment.pet.sex}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleApprove} disabled={isLoading}>
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
};

export default CareAppointmentDetails;
