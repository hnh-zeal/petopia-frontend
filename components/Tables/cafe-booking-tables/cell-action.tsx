"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CafeBooking } from "@/types/api";
import { Ban, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { updateCareAppointment } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

interface CellActionProps {
  data: CafeBooking;
}

const cancelSchema = z.object({
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters long")
    .max(500, "Reason must not exceed 500 characters"),
});

type CancelFormValues = z.infer<typeof cancelSchema>;

export const UserCellAction: React.FC<CellActionProps> = ({ data }) => {
  const auth = useRecoilValue(userAuthState);
  const [loading, setLoading] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const cancelForm = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleCancel = async (values: CancelFormValues) => {
    setIsCancelDialogOpen(false);
    setLoading(true);
    try {
      const apiData = await updateCareAppointment(
        data.id,
        {
          status: "CANCELLED",
          reason: values.reason,
        },
        auth?.accessToken as string
      );
      if (apiData.error) {
        toast({
          variant: "destructive",
          description: `${apiData.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Appointment cancelled successfully.",
        });
        window.location.reload();
      }
    } finally {
      setLoading(false);
      cancelForm.reset();
    }
  };

  const onCancel = () => {
    setIsCancelDialogOpen(false);
    cancelForm.reset();
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setIsCancelDialogOpen(true)}
          >
            <Ban className="mr-2 h-4 w-4" /> Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...cancelForm}>
            <form
              onSubmit={cancelForm.handleSubmit(handleCancel)}
              className="space-y-4"
            >
              <FormField
                control={cancelForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="reason">Reason for Cancellation</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the reason for cancellation (minimum 10 characters)"
                        className="mt-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <Button variant="ghost" type="button" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export const AdminCellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/doctors/${data.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4 hover:cursor-pointer" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4 hover:cursor-pointer" /> Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
