import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  MessageCircle,
  Star,
  Cat,
  Siren,
  CalendarIcon,
  Users,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { useRouter } from "next/router";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addDays,
  differenceInHours,
  format,
  parse,
  startOfDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/utils/zustand";
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
import { CafeRoom } from "@/types/api";
import { useEffect, useState } from "react";
import {
  defaultEndSlots,
  defaultTimeSlots,
} from "@/pages/pet-cafe/rooms/[id]/booking";
import { fetchRoomSlots } from "@/pages/api/api";

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required",
  }),
  startTime: z.string().min(1, "A time is required"),
  endTime: z.string().min(1, "A duration is required"),
  guests: z.number().min(1, "At least one guest is required"),
});

interface CafeRoomDetailProps {
  cafeRoom: CafeRoom;
}

export default function CafeRoomDetails({ cafeRoom }: CafeRoomDetailProps) {
  const [isClient, setIsClient] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>(defaultTimeSlots);
  const [endTimeSlots, setEndTimeSlots] = useState<string[]>(defaultEndSlots);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    setDate,
    setStartTime,
    setEndTime,
    setDuration,
    setGuests,
    setCafeRoom,
  } = useBookingStore();

  const today = startOfDay(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setDate(values.date);
    setStartTime(values.startTime);
    setEndTime(values.endTime);

    const start = parse(values.startTime, "hh:mm a", values.date);
    const end = parse(values.endTime, "hh:mm a", values.date);
    const duration = differenceInHours(end, start);
    setDuration(duration);
    setGuests(values.guests);
    setCafeRoom(cafeRoom);
    router.push(`/pet-cafe/rooms/${cafeRoom.id}/booking`);
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      setLoading(true);
      try {
        const fetchedTimeSlots = await fetchRoomSlots({
          roomId: cafeRoom.id,
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
        setLoading(false);
      }
    } else {
      setTimeSlots(defaultTimeSlots);
    }
    form.setValue("date", date as Date);
  };

  const handleStartTimeChange = (startTime: string) => {
    form.setValue("startTime", startTime);

    const startTimeIndex = defaultTimeSlots.indexOf(startTime);
    const updatedEndTimeSlots =
      startTimeIndex === 0
        ? defaultEndSlots
        : defaultEndSlots.slice(startTimeIndex);

    setEndTimeSlots(updatedEndTimeSlots);
  };

  const router = useRouter();
  const auth = useRecoilValue(userAuthState);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Return null on the server side
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-3xl font-bold">
          {cafeRoom.name} (Room No: {cafeRoom.roomNo})
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 space-x-4">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 xl:w-3/4 order-2 lg:order-1">
          <section id="carousel" className="mb-8">
            {cafeRoom.images?.length > 0 ? (
              <Carousel className="gap-3">
                <CarouselContent>
                  {cafeRoom.images.map((image: string, index: number) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/2 lg:basis-1/2"
                    >
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex relative aspect-square items-center justify-center ">
                            <Image
                              src={image}
                              alt={`${cafeRoom.name} - Image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <></>
            )}
          </section>

          <section id="room-info" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Room Information
            </h2>
            <p className="text-gray-700 text-pretty">{cafeRoom.description}</p>

            <div className="mt-4">
              <span className="text-2xl font-bold">
                Price: ${cafeRoom.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500 line-through ml-2">
                ${cafeRoom.price.toFixed(2)}
              </span>
              <span className="text-sm text-green-600">
                {cafeRoom.promotion}
              </span>
            </div>

            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < cafeRoom.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                ({cafeRoom.reviews} reviews)
              </span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Room Details:</h3>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Amenities:</h3>
              <ul className="list-disc list-inside">
                {cafeRoom.amenities?.map((amenity: string, index: number) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id="pet-info" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-800">Pets</h2>
              <Link
                href="/pet-cafe/pets"
                className="text-pink-600 hover:underline"
              >
                SEE OTHER PETS →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cafeRoom.pets.map((pet: any) => (
                <Card key={pet.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {pet.imageUrl && (
                      <div className="relative h-40 w-full">
                        <Image
                          src={pet.imageUrl}
                          alt={pet.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{pet.name}</div>
                      <p className=" text-base">
                        Pet Type & Breed: {pet.petType}
                      </p>
                      <p className="text-base">Age: {pet.age} years old</p>
                      <p className="text-base">Sex: {pet.sex}</p>
                      <p className="text-base">
                        Description: {pet.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="rules" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Rules & Policy
            </h2>
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Cancellation / Prepayment */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">ℹ️</span>
                  <div>
                    <h3 className="font-bold">Cancellation/ prepayment</h3>
                    <p>
                      Cancellation and prepayment policies vary according to
                      accommodation type. Please{" "}
                      <a href="#" className="text-blue-600">
                        enter the dates of your stay
                      </a>{" "}
                      and check the conditions of your required option.
                    </p>
                  </div>
                </div>

                {/* Children and Beds */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🔞</span>
                  <div>
                    <h3 className="font-bold">Age restriction</h3>
                    <p>Children under 18 must be supervised by the parents.</p>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🐾</span>
                  <div>
                    <h3 className="font-bold">Pets</h3>
                    <p>No Outside Pets are allowed.</p>
                  </div>
                </div>

                {/* Foods or Drinks */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">🍔</span>
                  <div>
                    <h3 className="font-bold">Food and Drinks</h3>
                    <p>No Outside Foods or Drinks are allowed.</p>
                  </div>
                </div>

                {/* Sanitization */}
                <div className="flex items-start">
                  <span className="text-xl mr-4">💦</span>
                  <div>
                    <h3 className="font-bold">Sanitation Rules</h3>
                    <p>
                      Customers are required to sanitize their hands before and
                      after interacting with the pets.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              For more information, please contact
            </h2>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-pink-600 mb-2">
                  Pet Cafe Department
                </h3>
                {cafeRoom.operatingHours?.map((day: any, index: number) => (
                  <p key={index}>{day.dow} from 7:00 AM to 4:00 PM.</p>
                ))}

                <p>Opening Hours: 7:00 AM to 4:00 PM.</p>
                <div className="mt-4">
                  <p>
                    <span className="font-semibold">Tel:</span>{" "}
                    {cafeRoom.contact}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 xl:w-1/4 order-1 lg:order-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#room-info"
                    className="flex items-center text-pink-600 hover:underline"
                  >
                    <HeartPulse className="mr-2 h-5 w-5" />
                    Room Information
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pet-info"
                    className="flex items-center text-gray-600 hover:underline"
                  >
                    <Cat className="mr-2 h-5 w-5" />
                    Pets
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="flex items-center text-gray-600 hover:underline"
                  >
                    <Siren className="mr-2 h-5 w-5" />
                    Rules
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="flex items-center text-gray-600 hover:underline"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="sticky top-20 space-y-4">
            {auth !== undefined ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col justify-between gap-5"
                >
                  <Card className="w-full max-w-sm">
                    <CardContent className="p-6 space-y-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Room Booking
                      </h2>

                      <div className="space-y-4">
                        {/* Date Field */}
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex-1">
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
                                          !field.value &&
                                            "text-muted-foreground"
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
                                        onSelect={handleDateChange}
                                        initialFocus
                                        disabled={(date) =>
                                          date < today ||
                                          date > addDays(today, 14)
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />

                        {/* Time Field */}
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="block text-sm font-medium text-gray-700">
                                Start Time
                                <span className="text-red-400"> *</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={handleStartTimeChange}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <div className="flex flex-row items-center gap-3">
                                      <Clock className="ml-1 w-4 h-4" />
                                      <SelectValue placeholder="Select time" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.length > 0 ? (
                                      timeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                          {slot}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <p className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                        No Slots Available. Please choose other
                                        date.
                                      </p>
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />

                        {/* End Time Field */}
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="block text-sm font-medium text-gray-700">
                                End Time<span className="text-red-400"> *</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger
                                    className={cn(
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <div className="flex flex-row items-center gap-3">
                                      <Clock className="ml-1 w-4 h-4" />
                                      <SelectValue placeholder="Select time" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {endTimeSlots.length > 0 ? (
                                      endTimeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                          {slot}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <p className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                        No Slots Available. Please choose other
                                        date.
                                      </p>
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />

                        {/* Guests Field */}
                        <FormField
                          control={form.control}
                          name="guests"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="block text-sm font-medium text-gray-700">
                                Number of guests
                                <span className="text-red-400"> *</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    id="guests"
                                    type="number"
                                    placeholder="Number of guests"
                                    min={1}
                                    {...field}
                                    className="pl-11"
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
                                  />

                                  <Users
                                    className={cn(
                                      "absolute ml-1 w-4 h-4 left-3 top-1/2 transform -translate-y-1/2",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Total</span>
                          <span className="font-semibold">
                            ${cafeRoom?.price}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-800"
                  >
                    Book this room
                  </Button>
                </form>
              </Form>
            ) : (
              <Button
                className="w-full bg-blue-900 hover:bg-blue-800"
                onClick={() => {
                  router.push("/register");
                }}
              >
                Register to book this room
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
