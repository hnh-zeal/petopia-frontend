import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/utils/zustand";
import {
  addDays,
  differenceInHours,
  format,
  parse,
  startOfDay,
} from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import {
  fetchCafeRoomByID,
  fetchDiscountPackage,
  fetchRoomSlots,
  submitBooking,
} from "@/pages/api/api";
import { toast } from "@/components/ui/use-toast";
import { useRecoilValue } from "recoil";
import { GetServerSideProps } from "next";
import { userAuthState } from "@/states/auth";
import { CafeRoom } from "@/types/api";

export const getServerSideProps: GetServerSideProps<{
  cafeRoom: CafeRoom;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const cafeRoom = await fetchCafeRoomByID(Number(id));
    return { props: { cafeRoom } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

export const defaultTimeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export const defaultEndSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required",
  }),
  startTime: z.string().min(1, "A time is required"),
  endTime: z.string().min(1, "A time is required"),
  guests: z.number().min(1, "At least one guest is required"),
  card: z.string().min(1, "Card information is required").optional(),
  month: z
    .string()
    .min(2, "Month is required")
    .max(2, "Invalid month")
    .optional(),
  year: z.string().min(2, "Year is required").max(2, "Invalid year").optional(),
  cvv: z.string().min(3, "CVV is required").max(4, "Invalid CVV").optional(),
  // billingAddress: z.string().min(1, "Billing address is required"),
  // billingCity: z.string().min(1, "City is required"),
  // billingState: z.string().min(1, "State is required"),
  // billingZip: z.string().min(1, "ZIP code is required"),
});

export default function ReservationConfirmation({
  cafeRoom,
}: {
  cafeRoom: CafeRoom;
}) {
  const today = startOfDay(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<string[]>(defaultTimeSlots);
  const [endTimeSlots, setEndTimeSlots] = useState<string[]>(defaultEndSlots);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const { date, startTime, endTime, duration, guests, setGuests, setDuration } =
    useBookingStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: date || new Date(),
      startTime,
      endTime,
      guests,
      // billingAddress: "",
      // billingCity: "",
      // billingState: "",
      // billingZip: "",
    },
  });

  useEffect(() => {
    const calculateTotalPrice = async () => {
      const basePrice = cafeRoom?.price || 0;
      const discountData = await fetchDiscountPackage(
        { type: "CAFE" },
        auth?.accessToken as string
      );
      const discountPercent = discountData?.package?.discountPercent || 0;
      setDiscountPercent(discountPercent);
      const discountAmount =
        basePrice * duration * guests * (discountPercent / 100);
      setDiscount(discountAmount);

      const totalPrice = basePrice * duration * guests - discountAmount;
      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [cafeRoom, duration, auth, guests]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formValues: any) => {
    setIsLoading(true);
    try {
      const { date, ...otherValues } = formValues;
      const formData = {
        ...otherValues,
        roomId: cafeRoom?.id,
        date: format(date, "yyyy-MM-dd"),
        duration,
        totalPrice,
      };

      const data = await submitBooking(formData, auth?.accessToken as string);
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: `${data.message}`,
        });
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = parse(startTime, "hh:mm a", form.getValues("date"));
    const end = parse(endTime, "hh:mm a", form.getValues("date"));
    return differenceInHours(end, start);
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      setIsLoading(true);
      try {
        const fetchedTimeSlots = await fetchRoomSlots({
          roomId: cafeRoom?.id,
          status: true,
          date,
        });

        const formattedTimeSlots = fetchedTimeSlots.slots.map((slot: any) =>
          format(new Date(slot.startTime), "h:mm a")
        );
        setTimeSlots(formattedTimeSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeSlots(defaultTimeSlots);
    }
    form.setValue("date", date as Date);
  };

  const handleStartTimeChange = (startTime: string) => {
    form.setValue("startTime", startTime);
    setDuration(calculateDuration(startTime, form.getValues("endTime")));
    const startTimeIndex = defaultTimeSlots.indexOf(startTime);
    const updatedEndTimeSlots =
      startTimeIndex === 0
        ? defaultEndSlots
        : defaultEndSlots.slice(startTimeIndex);

    setEndTimeSlots(updatedEndTimeSlots);
  };

  const handleEndTimeChange = (endTime: string) => {
    form.setValue("endTime", endTime);
    setDuration(calculateDuration(form.getValues("startTime"), endTime));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="after:content-['>'] after:mx-2">Room detail</li>
          <li>Booking</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Confirm your room booking</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Date & Time */}
              <Card className="w-full max-w-full space-y-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-bold">
                    Booking summary
                  </CardTitle>
                  <Button variant="ghost" type="button" onClick={toggleEdit}>
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-row gap-3">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger
                                asChild
                                disabled={!isEditing}
                                className="disabled:opacity-100"
                              >
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={!isEditing}
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
                        name="guests"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Number of Guests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    setGuests(parseInt(e.target.value));
                                    field.onChange(parseInt(e.target.value));
                                  }}
                                  className="pl-10 disabled:opacity-100"
                                  disabled={!isEditing}
                                />
                                <Users className="absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-row gap-3 ">
                      {/* <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={duration}
                                className="flex !mt-4 gap-3 disabled:opacity-100"
                                disabled={!isEditing}
                              >
                                {durationList.map((d) => (
                                  <FormItem
                                    key={d.value}
                                    className="flex items-center space-x-3"
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={d.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {d.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Start Time</FormLabel>
                            <Select
                              onValueChange={handleStartTimeChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="disabled:opacity-100">
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

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>End Time</FormLabel>
                            <Select
                              onValueChange={handleEndTimeChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="disabled:opacity-100">
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {endTimeSlots.map((slot) => (
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
                    {isEditing && (
                      <Button
                        type="button"
                        onClick={handleSave}
                        className="w-full"
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Credit Card Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Pay with Credit or Debit Card</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="card"
                    placeholder="Card"
                    label="Credit or Debit Card"
                    required={true}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-row gap-4">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="month"
                        placeholder="09"
                        label="MM"
                        required={true}
                      />
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="year"
                        placeholder="28"
                        label="YY"
                        required={true}
                      />
                    </div>
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="cvv"
                      placeholder="866"
                      label="CVV"
                      required={true}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="22 Rhine Street" />
                  <Input placeholder="Suite 1234A" />
                  <Input placeholder="Austin" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MS" />
                    <Input placeholder="4300" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              {/* Room Information */}
              {cafeRoom ? (
                <>
                  <Card>
                    <CardContent className="p-0">
                      <Image
                        src={cafeRoom?.mainImage || "/Pet Cafe/cafeRoom.jpg"}
                        alt="Cafe Room"
                        width={600}
                        height={600}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-semibold">
                              {cafeRoom?.name} ({cafeRoom?.roomNo})
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPinIcon className="w-4 h-4" />
                              <span>Bangkok, Thailand</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-semibold">
                              {cafeRoom?.rating || 4.8}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-semibold">Price details</h3>
                          <div className="flex justify-between text-sm">
                            <span>
                              ฿ {cafeRoom?.price} x {guests} guests x {duration}{" "}
                              h
                            </span>
                            <span>
                              ฿ {Number(cafeRoom?.price) * guests * duration}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Discount Package ({discountPercent} %)</span>
                            <span>฿ {discount}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span>฿ {totalPrice}</span>
                          </div>
                        </div>

                        {/* <div className="space-y-2">
                  <Label htmlFor="discount-code">Discount code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="discount-code"
                      placeholder="Apply your discount code here"
                    />
                    <Button>Redeem code</Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Got a discount code? Apply it now and watch those prices
                    drop!
                  </p>
                </div> */}
                      </div>
                    </CardContent>
                  </Card>

                  <Button type="submit" disabled={isEditing}>
                    {isLoading ? "Submitting" : "Submit Booking"}
                  </Button>
                </>
              ) : (
                <Card className="shadow-md border border-gray-200 rounded-lg">
                  <CardContent className="flex flex-col items-center p-4 space-y-4">
                    {/* Icon and Text */}
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="text-red-500 w-6 h-6" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Please select a room before booking
                      </h2>
                    </div>

                    {/* Button */}
                    <Button
                      type="button"
                      onClick={() => router.push("/pet-cafe/rooms")}
                      className=" text-white px-4 py-2 "
                    >
                      Choose Room First
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Cancellation Rules */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Cancellation policy</h3>
                <p className="text-sm text-gray-600">
                  Free cancellation before 2:00 PM on Oct 20. Cancel before Oct
                  27 for a partial refund.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  By selecting the button below, I agree to the Host&apos;s
                  House Rules, Ground rules for guests, Teraluxe&apos;s
                  Rebooking and Refund Policy, and that Teraluxe can charge my
                  payment method if I&apos;m responsible for damage.
                </p>
                <p className="text-sm text-gray-600">
                  I also agree to the{" "}
                  <a href="#" className="text-blue-600">
                    updated Terms of Service
                  </a>
                  ,{" "}
                  <a href="#" className="text-blue-600">
                    Payments Terms of Service
                  </a>
                  , and I acknowledge the{" "}
                  <a href="#" className="text-blue-600">
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
