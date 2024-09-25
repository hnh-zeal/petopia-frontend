"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, startOfDay } from "date-fns";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { CareService } from "@/types/api";
import {
  fetchRoomSlots,
  fetchServiceByID,
  submitCareAppointment,
} from "@/pages/api/api";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, PawPrint, Scissors, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetServerSideProps } from "next";

const formSchema = z.object({
  date: z.date({ required_error: "A date is required" }),
  startTime: z.string().min(1, "A time is required"),
  endTime: z.string().min(1, "A time is required"),
  petType: z.string().min(1, "Pet type is required"),
  breed: z.string().min(1, "Breed is required"),
  petName: z.string().min(1, "Pet name is required"),
  petSex: z.string().min(1, "Pet sex is required"),
  petAge: z.string().min(1, "Pet age is required"),
  healthConditions: z.string().optional(),
  specialInstructions: z.string().optional(),
  service: z.string().min(1, "Service is required"),
  addOns: z.array(z.string()).optional(),
  groomer: z.string().min(1, "Groomer is required"),
});

const petTypes = ["Dog", "Cat", "Bird", "Other"];
const breeds = {
  Dog: ["Labrador", "German Shepherd", "Golden Retriever", "Bulldog", "Poodle"],
  Cat: ["Persian", "Siamese", "Maine Coon", "British Shorthair", "Sphynx"],
  Bird: ["Parrot", "Canary", "Finch", "Cockatiel", "Budgerigar"],
  Other: ["Hamster", "Rabbit", "Guinea Pig", "Ferret", "Turtle"],
};

const groomingPackages = [
  {
    id: "basic",
    name: "Basic Grooming",
    description: "Includes bathing, brushing, and basic nail trim",
    price: 50,
    icon: <PawPrint className="h-6 w-6" />,
    rating: 4.5,
    duration: 60,
  },
  {
    id: "haircut",
    name: "Haircut & Styling",
    description: "Full grooming service with breed-specific haircut",
    price: 75,
    icon: <Scissors className="h-6 w-6" />,
    rating: 4.8,
    duration: 90,
  },
  {
    id: "advanced",
    name: "Advanced Grooming",
    description: "Premium package including spa treatments",
    price: 100,
    icon: <Sparkles className="h-6 w-6" />,
    rating: 4.9,
    duration: 120,
  },
];

const addOns = [
  { id: "nailTrim", name: "Nail Trim", price: 10 },
  { id: "teethCleaning", name: "Teeth Cleaning", price: 15 },
  { id: "earCleaning", name: "Ear Cleaning", price: 12 },
];

const groomers = [
  { id: "groomer1", name: "Alice Johnson", rating: 4.9 },
  { id: "groomer2", name: "Bob Smith", rating: 4.7 },
  { id: "groomer3", name: "Carol Williams", rating: 4.8 },
];

export default function GroomingAppointment({
  service,
}: {
  service: CareService;
}) {
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const today = startOfDay(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addOns: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
        roomId: service?.id,
      };
      const response = await submitCareAppointment(
        formData,
        auth?.accessToken as string
      );
      if (response.error) {
        toast({ variant: "destructive", description: response.message });
      } else {
        toast({ variant: "success", description: response.message });
        router.push("/");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      toast({
        variant: "destructive",
        description: "An error occurred while submitting your booking.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      setIsLoading(true);
      try {
        const fetchedTimeSlots = await fetchRoomSlots({
          roomId: service?.id,
          status: true,
          date,
        });
        setTimeSlots(
          fetchedTimeSlots.slots.map((slot: any) =>
            format(new Date(slot.startTime), "h:mm a")
          )
        );
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    }
    form.setValue("date", date as Date);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="after:content-['>'] after:mx-2">Pet Care Service</li>
          <li>Confirm Appointment</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-6">
        Book Your Pet Care Appointment
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={handleDateChange}
                                disabled={(date) =>
                                  date < today || date > addDays(today, 14)
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
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or instructions for the pet sitter"
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
                              {petTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select breed" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {breeds[
                                form.watch("petType") as keyof typeof breeds
                              ]?.map((breed) => (
                                <SelectItem key={breed} value={breed}>
                                  {breed}
                                </SelectItem>
                              ))}
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
                      name="petName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pet name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="petSex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sex</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Male</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Female</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
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
                              placeholder="Enter pet age"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="petAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Age (Years)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter pet age"
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
                    name="healthConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any health conditions or allergies"
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
                  <CardTitle>{service?.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Service Category</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            {groomingPackages.map((pkg) => (
                              <div key={pkg.id} className="relative">
                                <RadioGroupItem
                                  value={pkg.id}
                                  id={pkg.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={pkg.id}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  {pkg.icon}
                                  <span className="mt-2 font-semibold">
                                    {pkg.name}
                                  </span>
                                  <span className="mt-1 text-sm">
                                    ฿{pkg.price}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="groomer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Pet Sitter</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            {groomers.map((groomer) => (
                              <div key={groomer.id} className="relative">
                                <RadioGroupItem
                                  value={groomer.id}
                                  id={groomer.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={groomer.id}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <span className="font-semibold">
                                    {groomer.name}
                                  </span>
                                  <span className="mt-1 text-sm flex items-center">
                                    <Star className="h-4 w-4 fill-primary mr-1" />
                                    {groomer.rating}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("service") === "advanced" && (
                    <FormField
                      control={form.control}
                      name="addOns"
                      render={() => (
                        <FormItem>
                          <FormLabel>Add-ons</FormLabel>
                          <div className="space-y-2">
                            {addOns.map((addOn) => (
                              <div
                                key={addOn.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={addOn.id}
                                  checked={form
                                    .watch("addOns")
                                    ?.includes(addOn.id)}
                                  onCheckedChange={(checked) => {
                                    const currentAddOns =
                                      form.watch("addOns") || [];
                                    if (checked) {
                                      form.setValue("addOns", [
                                        ...currentAddOns,
                                        addOn.id,
                                      ]);
                                    } else {
                                      form.setValue(
                                        "addOns",
                                        currentAddOns.filter(
                                          (id) => id !== addOn.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={addOn.id}
                                  className="text-sm font-medium leading-none"
                                >
                                  {addOn.name} (฿{addOn.price})
                                </Label>
                              </div>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service</span>
                      <span>
                        ฿
                        {groomingPackages.find(
                          (pkg) => pkg.id === form.watch("service")
                        )?.price || 0}
                      </span>
                    </div>
                    {form.watch("addOns")?.map((addOnId) => {
                      const addOn = addOns.find((a) => a.id === addOnId);
                      return (
                        <div
                          key={addOnId}
                          className="flex justify-between text-sm"
                        >
                          <span>{addOn?.name}</span>
                          <span>฿{addOn?.price}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>
                        ฿
                        {groomingPackages.find(
                          (pkg) => pkg.id === form.watch("service")
                        )?.price +
                          form
                            .watch("addOns")
                            ?.reduce(
                              (total, addOnId) =>
                                total +
                                (addOns.find((a) => a.id === addOnId)?.price ||
                                  0),
                              0
                            )}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Confirm Booking"}
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
