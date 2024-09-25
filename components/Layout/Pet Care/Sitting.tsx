"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, startOfDay, addHours } from "date-fns";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
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
import {
  CalendarIcon,
  Clock,
  Home,
  MapPin,
  PawPrint,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CareService } from "@/types/api";

const formSchema = z.object({
  serviceCategory: z.enum([
    "Standard Sitting",
    "Overnight Sitting",
    "In-home Sitting",
    "Daytime Sitting",
  ]),
  startDate: z.date(),
  startTime: z.string(),
  duration: z.number().min(1),
  isOvernight: z.boolean(),
  petType: z.enum(["Dog", "Cat", "Bird", "Other"]),
  petSize: z.enum(["Small", "Medium", "Large"]),
  petName: z.string().min(1, "Pet name is required"),
  specialInstructions: z.string().optional(),
  location: z.enum(["Client's Home", "Sitter's Home"]),
  address: z.string().min(1, "Address is required"),
  sitterId: z.string().min(1, "Pet sitter selection is required"),
  addOns: z.array(z.string()).optional(),
  recurringSchedule: z.enum(["None", "Daily", "Weekly", "Custom"]).optional(),
});

const petSitters = [
  {
    id: "1",
    name: "Alice Johnson",
    rating: 4.9,
    hourlyRate: 25,
    specialties: ["Anxious pets", "Medication administration"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Bob Smith",
    rating: 4.7,
    hourlyRate: 22,
    specialties: ["Elderly pets", "Multiple pets"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Carol Williams",
    rating: 4.8,
    hourlyRate: 23,
    specialties: ["Puppies", "Training"],
    image: "/placeholder.svg?height=100&width=100",
  },
];

const addOns = [
  { id: "bathing", name: "Bathing", price: 15 },
  { id: "walking", name: "Extra Walking", price: 10 },
  { id: "feeding", name: "Special Feeding", price: 5 },
  { id: "medication", name: "Medication Administration", price: 10 },
];

export default function SittingAppointment({
  service,
}: {
  service: CareService;
}) {
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceCategory: "Standard Sitting",
      isOvernight: false,
      addOns: [],
      recurringSchedule: "None",
    },
  });

  const watchFields = form.watch();

  useEffect(() => {
    calculateTotalPrice();
  }, [watchFields]);

  const calculateTotalPrice = () => {
    const selectedSitter = petSitters.find(
      (sitter) => sitter.id === watchFields.sitterId
    );
    const basePrice = selectedSitter
      ? selectedSitter.hourlyRate * watchFields.duration
      : 0;
    const addOnPrice =
      watchFields.addOns?.reduce((total, addOnId) => {
        const addOn = addOns.find((a) => a.id === addOnId);
        return total + (addOn?.price || 0);
      }, 0) || 0;
    const overnightFee = watchFields.isOvernight ? 50 : 0;
    setTotalPrice(basePrice + addOnPrice + overnightFee);
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
          "Your pet sitting appointment has been booked successfully.",
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
      <h1 className="text-3xl font-bold mb-6">Book Your Pet Sitting Service</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="serviceCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Standard Sitting">
                              Standard Sitting
                            </SelectItem>
                            <SelectItem value="Overnight Sitting">
                              Overnight Sitting
                            </SelectItem>
                            <SelectItem value="In-home Sitting">
                              In-home Sitting
                            </SelectItem>
                            <SelectItem value="Daytime Sitting">
                              Daytime Sitting
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (hours)</FormLabel>
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
                    name="isOvernight"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Overnight Stay</FormLabel>
                          <FormDescription>
                            Check if the sitting extends overnight
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pet Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                              <SelectItem value="Bird">Bird</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="petSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pet size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Small">Small</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special care instructions, dietary needs, or health concerns"
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
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sitting Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sitting location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Client's Home">
                              <div className="flex items-center">
                                <Home className="mr-2 h-4 w-4" />
                                Client's Home
                              </div>
                            </SelectItem>
                            <SelectItem value="Sitter's Home">
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                Sitter's Home
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the address for pet sitting"
                            {...field}
                          />
                        </FormControl>
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
                  <CardTitle>Pet Sitter Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="sitterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose a Pet Sitter</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4 pt-2"
                          >
                            {petSitters.map((sitter) => (
                              <div key={sitter.id}>
                                <RadioGroupItem
                                  value={sitter.id}
                                  id={sitter.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={sitter.id}
                                  className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <div className="flex items-center space-x-4">
                                    <Avatar>
                                      <AvatarImage
                                        src={sitter.image}
                                        alt={sitter.name}
                                      />
                                      <AvatarFallback>
                                        {sitter.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium leading-none">
                                        {sitter.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        ${sitter.hourlyRate}/hour
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-primary mr-1" />
                                    <span className="text-sm">
                                      {sitter.rating}
                                    </span>
                                  </div>
                                </Label>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Specialties: {sitter.specialties.join(", ")}
                                </p>
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
                  <CardTitle>Add-ons & Scheduling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            Select any additional services you'd like to include
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
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
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
                        ${totalPrice - (watchFields.isOvernight ? 50 : 0)}
                      </span>
                    </div>
                    {watchFields.isOvernight && (
                      <div className="flex justify-between">
                        <span>Overnight Fee</span>
                        <span>$50</span>
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
            </div>
          </div>
        </form>
      </Form>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          By confirming this booking, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
