"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, startOfDay } from "date-fns";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { CareService, PetSitter } from "@/types/api";
import {
  createCareAppointment,
  fetchDiscountPackage,
  fetchRoomSlots,
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
import { Breadcrumbs } from "@/components/breadcrumbs";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, PawPrint, Scissors, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { breeds, GenderOptions, petTypes } from "@/constants/data";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  categoryId: z.number(),
  sitterId: z.string().optional(),
  date: z.date(),
  time: z.string(),
  duration: z.number().min(1).optional(),
  petName: z.string().min(1, "Pet name is required"),
  petType: z.string(),
  breed: z.string(),
  description: z.string().optional(),
  healthConditions: z.string().optional(),
  addOns: z.any().optional(),
});

const breadcrumbItems = (service: CareService) => [
  { title: "Pet Care Services", link: "/pet-care/services" },
  { title: `${service.name}`, link: `/pet-care/services/${service.id}` },
  {
    title: `Confirm Appointment`,
    link: `/pet-care/services/${service.id}/appointment`,
  },
];

type CreateCareFormValue = z.infer<typeof formSchema>;

export default function GroomingAppointment({
  service,
}: {
  service: CareService;
}) {
  const today = startOfDay(new Date());
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discount, setDiscount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 1,
      addOns: [],
    },
  });

  const watchFields = form.watch();
  useEffect(() => {
    const calculateTotalPrice = async () => {
      const basePrice = service.price;
      const discountData = await fetchDiscountPackage(
        { type: "CARE" },
        auth?.accessToken as string
      );
      const addOnPrice =
        watchFields.addOns?.reduce((total: number, addOnId: any) => {
          const addOn = service.addOns?.find((a) => a.id === addOnId);
          return total + (addOn?.price || 0);
        }, 0) || 0;

      const discountPercent = discountData?.package?.discountPercent || 0;
      setDiscountPercent(discountPercent);
      console.log(discountPercent);
      const discountAmount = (basePrice + addOnPrice) * (discountPercent / 100);
      setDiscount(discountAmount);
      setTotalPrice(basePrice + addOnPrice - discountAmount);
    };

    calculateTotalPrice();
  }, [service, auth, watchFields]);

  const onSubmit = async (formValues: CreateCareFormValue) => {
    setIsLoading(true);
    try {
      const { petType, petName, breed, date, time, ...other } = formValues;

      const formData = {
        petData: {
          option: "new",
          name: petName,
          petType,
        },
        appointmentData: {
          serviceId: service.id,
          date: format(date, "yyyy-MM-dd"),
          time,
          totalPrice,
          ...other,
        },
      };

      const data = await createCareAppointment(
        formData,
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
          description: "Care Appointment submitted successfully.",
        });
        router.push(`/`);
      }
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
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems(service)} />
      </div>

      {/* <h1 className="text-3xl font-bold mb-6">
        Book Your Pet Care Appointment
      </h1> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Service Category</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            className="grid grid-cols-3 gap-4"
                          >
                            {service.categories?.map((category) => (
                              <div key={category.id} className="relative">
                                <RadioGroupItem
                                  value={category.id}
                                  id={category.id}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={category.id}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  {category.icon || (
                                    <PawPrint className="h-4 w-4" />
                                  )}
                                  <span className="mt-2 font-semibold">
                                    {category.name}
                                  </span>
                                  <span className="mt-1 text-sm">
                                    ฿{category.price}
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
                      name="time"
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
                    name="description"
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
                            className="grid gap-4 pt-2"
                          >
                            {service.petSitters?.map((sitter) => (
                              <div key={sitter.id}>
                                <RadioGroupItem
                                  value={`${sitter.id}`}
                                  id={`${sitter.name}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={sitter.name}
                                  className="flex flex-col rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <Avatar>
                                        <AvatarImage
                                          src={sitter.profileUrl || ""}
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
                                          {/* ${sitter?.hourlyRate}/hour */}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 fill-primary mr-1" />
                                      <span className="text-sm">
                                        {sitter?.rating}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm">{sitter.about}</p>
                                  <div className="mt-2">
                                    <span className="text-sm font-medium">
                                      Specialties:{" "}
                                    </span>
                                    {sitter.specialties?.map(
                                      (specialty: string, index: number) => (
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
                  <CardTitle>Add-on Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="addOns"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormDescription>
                            Select any additional services you&apos;d like to
                            include
                          </FormDescription>
                        </div>
                        {service.addOns?.map((item) => (
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
                                                (value: number) =>
                                                  value !== item.id
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
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="petType"
                      label="Pet Type"
                      placeholder="Select Pet Type"
                      required={true}
                    >
                      {petTypes.map((pet, i) => (
                        <SelectItem key={i} value={pet.value}>
                          <div className="flex cursor-pointer items-center gap-2">
                            <p>{pet.label}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </CustomFormField>

                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="breed"
                      label="Breed"
                      placeholder="Select Breed"
                    >
                      {breeds[
                        form.watch("petType") as keyof typeof breeds
                      ]?.map((breed: any, i: number) => (
                        <SelectItem key={breed} value={breed.value}>
                          {breed.label}
                        </SelectItem>
                      ))}
                    </CustomFormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="petName"
                      label="Pet Name"
                      placeholder="Enter your pet's name"
                      required={true}
                    />

                    <CustomFormField
                      fieldType={FormFieldType.SKELETON}
                      control={form.control}
                      name="petSex"
                      label="Sex"
                      renderSkeleton={(field) => (
                        <FormControl>
                          <RadioGroup
                            className="flex h-11 gap-6 xl:justify-evenly"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            {GenderOptions.map((option, i) => {
                              const capitalizedOption =
                                option.charAt(0).toUpperCase() +
                                option.slice(1).toLowerCase();

                              return (
                                <div key={i} className="radio-group">
                                  <div className="flex flex-row space-x-2 justify-around items-center mt-3">
                                    <RadioGroupItem
                                      value={option}
                                      id={capitalizedOption}
                                    />
                                    <Label
                                      htmlFor={capitalizedOption}
                                      className="cursor-pointer"
                                    >
                                      {capitalizedOption}
                                    </Label>
                                  </div>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
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

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>฿ {service.price}</span>
                    </div>

                    {watchFields.addOns?.map((addOnId: any) => {
                      const addOn = service.addOns?.find(
                        (a) => a.id === addOnId
                      );
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

                    <div className="flex justify-between text-sm">
                      <span>Discount Package ({discountPercent} %)</span>
                      <span>฿ {discount}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>฿ {totalPrice}</span>
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
                  Free cancellation before {form.getValues("time")} on{" "}
                  {format(addDays(new Date(), 1), "MMM dd")}. Cancel before{" "}
                  {format(addDays(new Date(), 7), "MMM dd")} for a partial
                  refund.
                </p>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  By confirming this booking, I agree to the Host&apos;s House
                  Rules, Ground rules for guests, Rebooking and Refund Policy,
                  and that the service provider can charge my payment method if
                  I&apos;m responsible for damage.
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
