"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, startOfDay, addHours } from "date-fns";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { CalendarIcon, Home, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CareService } from "@/types/api";
import { Breadcrumbs } from "@/components/breadcrumbs";

const formSchema = z.object({
  trainingType: z.any(),
  sessionCount: z.number().min(1, "At least one session is required"),
  sessionDuration: z
    .number()
    .min(30, "Session duration must be at least 30 minutes"),
  petName: z.string().min(1, "Pet name is required"),
  petType: z.enum(["Dog", "Cat", "Other"]),
  petAge: z.number().min(0, "Age must be a positive number"),
  petBreed: z.string().min(1, "Breed is required"),
  behavioralIssues: z.string().optional(),
  trainerId: z.string().min(1, "Trainer selection is required"),
  trainingLocation: z.enum([
    "Trainer's Facility",
    "Owner's Home",
    "Park/Neutral Location",
  ]),
  startDate: z.date(),
  startTime: z.string(),
  recurringSchedule: z.enum(["One-time", "Weekly", "Bi-weekly", "Custom"]),
  addOns: z.array(z.string()).optional(),
});

const breadcrumbItems = (service: CareService) => [
  { title: "Pet Care Services", link: "/pet-care/services" },
  { title: `${service.name}`, link: `/pet-care/services/${service.id}` },
  {
    title: `Confirm Appointment`,
    link: `/pet-care/services/${service.id}/appointment`,
  },
];

const addOns = [
  { id: "followUp", name: "Follow-up Consultation", price: 30 },
  { id: "videoRecording", name: "Video Recording of Sessions", price: 20 },
];

export default function TrainingAppointment({
  service,
}: {
  service: CareService;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionCount: 1,
      sessionDuration: 60,
      trainingLocation: "Trainer's Facility",
      recurringSchedule: "One-time",
      addOns: [],
    },
  });

  const today = startOfDay(new Date());
  const watchFields = form.watch();

  useEffect(() => {
    calculateTotalPrice();
  }, [watchFields]);

  const calculateTotalPrice = () => {
    const basePrice = service.price;
    const locationFee =
      watchFields.trainingLocation === "Owner's Home" ? 10 : 0;
    const addOnPrice =
      watchFields.addOns?.reduce((total, addOnId) => {
        const addOn = addOns.find((a) => a.id === addOnId);
        return total + (addOn?.price || 0);
      }, 0) || 0;
    setTotalPrice(basePrice + locationFee + addOnPrice);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Booking submitted:", data);
      toast({
        title: "Booking Confirmed",
        description:
          "Your pet training appointment has been booked successfully.",
      });
      router.push("/bookings");
    } catch (error) {
      console.error("Booking submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while submitting your booking.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems(service)} />
      </div>
      {/* <h1 className="text-3xl font-bold mb-6">
        Book Your Pet Training Service
      </h1> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Program Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trainingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Training type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {service.categories?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={`${category.id}`}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="block text-sm font-medium text-gray-700">
                            Date<span className="text-red-400"> *</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value
                                      ? format(field.value, "PPP")
                                      : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    disabled={(date) =>
                                      date < today || date > addDays(today, 14)
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => i).map(
                                (hour) => (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {format(
                                      addHours(startOfDay(new Date()), hour),
                                      "h:mm a"
                                    )}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sessionDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Duration (minutes)</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trainingLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Training Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select training location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Trainer's Facility">
                                <div className="flex items-center">
                                  <Home className="mr-2 h-4 w-4" />
                                  Trainer&apos;s Facility
                                </div>
                              </SelectItem>
                              <SelectItem value="Owner's Home">
                                <div className="flex items-center">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Owner&apos;s Home
                                </div>
                              </SelectItem>
                              <SelectItem value="Park/Neutral Location">
                                <div className="flex items-center">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Park/Neutral Location
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trainer Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="trainerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose a Trainer</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4 pt-2"
                          >
                            {service.petSitters?.map((trainer) => (
                              <div key={trainer.id}>
                                <RadioGroupItem
                                  value={`${trainer.id}`}
                                  id={`${trainer.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`${trainer.id}`}
                                  className="flex flex-col rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <Avatar>
                                        <AvatarImage
                                          src={trainer.profileUrl || ""}
                                          alt={trainer.name}
                                        />
                                        <AvatarFallback>
                                          {trainer.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium leading-none">
                                          {trainer.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          ${trainer?.hourlyRate}/hour
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 fill-primary mr-1" />
                                      <span className="text-sm">
                                        {trainer?.rating}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm">
                                    {trainer.about}
                                  </p>
                                  <div className="mt-2">
                                    <span className="text-sm font-medium">
                                      Specialties:{" "}
                                    </span>
                                    {trainer.specialties?.map(
                                      (specialty, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="mr-1"
                                        >
                                          {specialty}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Add-ons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date > addDays(new Date(), 30)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => i).map(
                                (hour) => (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {format(
                                      addHours(startOfDay(new Date()), hour),
                                      "h:mm a"
                                    )}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="recurringSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recurring Schedule</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="One-time">One-time</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addOns"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Add-on Services
                          </FormLabel>
                          <FormDescription>
                            Select any additional services you&apos;d like to
                            include
                          </FormDescription>
                        </div>
                        {addOns.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="addOns"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.name} (${item.price})
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pet Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="petName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your pet's name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pet type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dog">Dog</SelectItem>
                              <SelectItem value="Cat">Cat</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="petAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Age (Years)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petBreed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Breed</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your pet's breed"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="behavioralIssues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Behavioral Issues (if any)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any specific behavioral issues your pet has"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>
                        $
                        {totalPrice -
                          (watchFields.trainingLocation === "Owner's Home"
                            ? 10
                            : 0)}
                      </span>
                    </div>
                    {watchFields.trainingLocation === "Owner's Home" && (
                      <div className="flex justify-between">
                        <span>Home Visit Fee</span>
                        <span>$10</span>
                      </div>
                    )}
                    {watchFields.addOns?.map((addOnId) => {
                      const addOn = addOns.find((a) => a.id === addOnId);
                      return (
                        <div
                          key={addOnId}
                          className="flex justify-between text-sm"
                        >
                          <span>{addOn?.name}</span>
                          <span>${addOn?.price}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Confirm Booking"}
                  </Button>
                </CardFooter>
              </Card>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                <p className="text-sm text-gray-600">
                  Free cancellation before {form.getValues("startTime")} on{" "}
                  {format(addDays(new Date(), 1), "MMM dd")}. Cancel before{" "}
                  {format(addDays(new Date(), 7), "MMM dd")} for a partial
                  refund.
                </p>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  By confirming this booking, I agree to the Host's House Rules,
                  Ground rules for guests, Rebooking and Refund Policy, and that
                  the service provider can charge my payment method if I'm
                  responsible for damage.
                </p>
                <p>
                  I also agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                  ,{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Payments Terms of Service
                  </a>
                  , and I acknowledge the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
