"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { CreateSlotSchema } from "@/validations/formValidation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { createDateSchedule, createRoomSlots } from "@/pages/api/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/router";

type CreateSlotFormValue = z.infer<typeof CreateSlotSchema>;

export default function CreateScheduleForm({ onCancel }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const form = useForm<CreateSlotFormValue>({});

  const onSubmit = async (formValues: CreateSlotFormValue) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        doctorId: Number(id),
      };
      const data = await createDateSchedule(formData);

      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Appointment Schedule created.",
        });
        window.location.reload();
        onCancel();
      }
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.reset();
    onCancel();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 w-full"
        >
          <div className="flex flex-row items-center justify-between space-x-1 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[220px] text-left font-normal",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange} // Update form state directly
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[220px] text-left font-normal",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange} // Update form state directly
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-row mt-10 items-center justify-between space-x-4">
            <Button
              disabled={loading}
              variant="outline"
              type="button"
              className="ml-auto w-full sm:w-auto"
              onClick={onReset}
            >
              Cancel
            </Button>
            <SubmitButton
              isLoading={loading}
              className="ml-auto w-full sm:w-auto"
            >
              Create
            </SubmitButton>
          </div>
        </form>
      </Form>
    </>
  );
}
