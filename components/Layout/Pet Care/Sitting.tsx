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
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breeds, petTypes } from "@/constants/data";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { createCareAppointment, fetchDiscountPackage } from "@/pages/api/api";
import { Badge } from "@/components/ui/badge";

const breadcrumbItems = (service: CareService) => [
  { title: "Pet Care Services", link: "/pet-care/services" },
  { title: `${service.name}`, link: `/pet-care/services/${service.id}` },
  {
    title: `Confirm Appointment`,
    link: `/pet-care/services/${service.id}/appointment`,
  },
];

const formSchema = z.object({
  categoryId: z.number(),
  sitterId: z.string().min(1, "Pet sitter selection is required"),
  date: z.date(),
  time: z.string(),
  duration: z.number().min(1).optional(),
  petName: z.string().min(1, "Pet name is required"),
  petType: z.string(),
  breed: z.string(),
  description: z.string().optional(),
  location: z.enum(["Client's Home", "Sitter's Home"]).optional(),
  address: z.string().optional(),
  addOns: z.any().optional(),
});

type CreateCareFormValue = z.infer<typeof formSchema>;

export default function SittingAppointment({
  service,
}: {
  service: CareService;
}) {
  const router = useRouter();
  const today = startOfDay(new Date());
  const auth = useRecoilValue(userAuthState);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems(service)} />
      </div>
      {/* <h1 className="text-3xl font-bold mb-6">Book Your Pet Sitting Service</h1> */}

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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Service Category</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            className="grid grid-cols-2 gap-4"
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
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 place-content-center gap-6 xl:flex-row">
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
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 9 }, (_, i) => i + 9).map(
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

                  <div className="grid grid-cols-2 place-content-center gap-6 xl:flex-row">
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
                                  Client&apos;s Home
                                </div>
                              </SelectItem>
                              <SelectItem value="Sitter's Home">
                                <div className="flex items-center">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Sitter&apos;s Home
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.getValues("location") === "Client's Home" && (
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
                  )}
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
                        <FormLabel>Choose a Trainer</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                                  htmlFor={`${sitter.name}`}
                                  className="flex flex-col rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <Avatar>
                                        <AvatarImage
                                          src={
                                            sitter.profileUrl ||
                                            "/default-pet-sitter.png"
                                          }
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
                      required={true}
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
                    name="description"
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
