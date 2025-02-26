import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heading } from "@/components/ui/heading";
import {
  CalendarDays,
  ChevronRight,
  Coffee,
  PawPrint,
  Stethoscope,
  Users,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OverviewData, PieData } from "@/types/api";
import { fetchOverviewReport, fetchPieData } from "../api/api";
import { GetServerSideProps } from "next";
import { months } from "@/constants/data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncate } from "@/utils/truncate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const breadcrumbItems = [{ title: "Dashboard", link: "/admin/dashboard" }];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export const getServerSideProps: GetServerSideProps<{
  overviewData: OverviewData;
  pieData: PieData;
}> = async (context) => {
  try {
    const overviewData = await fetchOverviewReport({ date: new Date() });
    const pieData = await fetchPieData({
      month: currentMonth,
      year: currentYear,
    });

    return { props: { overviewData, pieData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

const statusConfig: any = {
  PENDING: { color: "bg-yellow-500", label: "Pending" },
  ACCEPTED: { color: "bg-green-500", label: "Accepted" },
  true: { color: "bg-green-500", label: "Booked" },
  false: { color: "bg-red-500", label: "Cancelled" },
  REJECTED: { color: "bg-red-700", label: "Rejected" },
  CANCELLED: { color: "bg-gray-500 ", label: "Cancelled" },
};

interface AppointmentItemProps {
  id: number;
  date: Date;
  name: string;
  description: string;
  status: string;
  imageUrl?: string;
  type: string;
}

export const AppointmentItem = ({
  id,
  date,
  name,
  description,
  status,
  imageUrl,
  type,
}: AppointmentItemProps) => {
  const router = useRouter();
  const redirectLink =
    type === "clinic"
      ? `/admin/pet-clinic/appointments/${id}`
      : type === "care"
        ? `/admin/pet-care/appointments/${id}`
        : `/admin/pet-cafe/room-booking/${id}`;
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{truncate(description, 50)}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {format(date, "hh:mm a")}
            </div>

            <Badge
              className={`${statusConfig[status].color} px-2 py-1 rounded-full`}
            >
              {statusConfig[status].label}
            </Badge>
          </div>
          <Button
            variant={"ghost"}
            onClick={() => router.push(`${redirectLink}`)}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard({
  overviewData,
  pieData,
}: {
  overviewData: OverviewData;
  pieData: PieData;
}) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState("clinic");
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [overview, setOverview] = useState<OverviewData>(overviewData);
  const [appointments, setAppointments] = useState<any>(
    overview.appointments?.clinicAppointments
  );

  const defaultPieData = {
    labels: [
      "Pet Clinic Appointments",
      "Pet Care Appointments",
      "Pet Cafe Bookings",
    ],
    datasets: [
      {
        data: [
          pieData.clinic_count || 0,
          pieData.care_count || 0,
          pieData.cafe_count || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const [pieChartData, setPieChartData] = useState(defaultPieData);
  const handleMonthChange = async (value: string) => {
    const monthIndex = months.indexOf(value) + 1;

    setSelectedMonth(monthIndex);

    try {
      const fetchedPieData = await fetchPieData({
        month: monthIndex,
        year: currentYear,
      });

      setPieChartData({
        labels: ["Clinic Visits", "Care", "Cafe Bookings"],
        datasets: [
          {
            data: [
              fetchedPieData.clinic_count || 0,
              fetchedPieData.care_count || 0,
              fetchedPieData.cafe_count || 0,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch pie data", error);
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    switch (value) {
      case "clinic":
        setAppointments(overview.appointments?.clinicAppointments);
        break;
      case "care":
        setAppointments(overview.appointments?.careAppointments);
        break;
      case "cafe":
        setAppointments(overview.appointments?.cafeBookings);
        break;
    }
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      setLoading(true);
      setDate(date);
      try {
        const fetchedOverview = await fetchOverviewReport({ date });
        setOverview(fetchedOverview);
        switch (type) {
          case "clinic":
            setAppointments(fetchedOverview.appointments?.clinicAppointments);
            break;
          case "care":
            setAppointments(fetchedOverview.appointments?.careAppointments);
            break;
          case "cafe":
            setAppointments(fetchedOverview.appointments?.cafeBookings);
            break;
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden ">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16 bg-gray-100">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 ">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between space-y-2">
              <Heading title={`Welcome to Management Panel!`} />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {!loading && (
              <ScrollArea className="h-[calc(100vh-220px)] pl-2 pr-5">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Clinic Appointments
                          </CardTitle>
                          <Stethoscope className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            +{overview.count.clinic_count}
                          </div>
                          {/* <p className="text-xs text-muted-foreground">
                          +20.1% from last month
                        </p> */}
                        </CardContent>
                      </motion.div>
                    </Card>

                    <Card>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Pet Care Appointments
                          </CardTitle>
                          <PawPrint className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            +{overview.count.care_count}
                          </div>
                          {/* <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p> */}
                        </CardContent>
                      </motion.div>
                    </Card>

                    <Card>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Pet Cafe Room Booking
                          </CardTitle>
                          <Coffee className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            +{overview.count.cafe_count}
                          </div>
                          {/* <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p> */}
                        </CardContent>
                      </motion.div>
                    </Card>

                    <Card>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            New Users
                          </CardTitle>
                          <Users className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            +{overview.count.user_count}
                          </div>
                          {/* <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p> */}
                        </CardContent>
                      </motion.div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4 md:col-span-3">
                      <Card className="w-full max-w-3xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Pet Services</CardTitle>
                            <Select
                              value={months[selectedMonth - 1]}
                              onValueChange={handleMonthChange}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[385px] flex items-center justify-center">
                              <Pie
                                data={pieChartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: "bottom" as const,
                                    },
                                    title: {
                                      display: true,
                                      text: `Appointments and Bookings for ${months[selectedMonth - 1]}`,
                                    },
                                  },
                                }}
                              />
                            </div>
                          </CardContent>
                        </motion.div>
                      </Card>
                    </div>

                    <div className="col-span-4">
                      <Card className="bg-white rounded-lg shadow">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="flex flex-row items-center space-x-2">
                              <CalendarDays className="mr-2 text-blue-500" />
                              <CardTitle className="text-xl font-bold flex items-center">
                                Total Appointments (
                                {`${format(date as Date, "yyyy-MMM-dd")}`})
                              </CardTitle>
                            </div>
                            <Select
                              value={type}
                              onValueChange={handleTypeChange}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem key={"clinic"} value={"clinic"}>
                                  Pet Clinic
                                </SelectItem>
                                <SelectItem key={"care"} value={"care"}>
                                  Pet Care
                                </SelectItem>
                                <SelectItem key={"cafe"} value={"cafe"}>
                                  Pet Cafe
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </CardHeader>
                          <CardContent className="m-2">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex flex-row gap-3 justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-500">
                                  APPOINTMENTS{" "}
                                </h3>
                                <span className="bg-blue-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                                  {appointments.length}
                                </span>
                              </div>
                              <Button
                                variant={"ghost"}
                                onClick={() => {
                                  type === "cafe"
                                    ? router.push(
                                        `/admin/pet-cafe/room-booking`
                                      )
                                    : router.push(
                                        `/admin/pet-${type}/appointments`
                                      );
                                }}
                                className="text-sm text-blue-500"
                              >
                                View All
                              </Button>
                            </div>

                            {appointments?.map(
                              (appointment: any, i: number) => (
                                <div key={i}>
                                  <AppointmentItem
                                    id={appointment.id}
                                    date={
                                      appointment?.startTime || appointment.date
                                    }
                                    name={appointment.user.name}
                                    description={appointment.description}
                                    status={appointment.status}
                                    imageUrl={appointment.user.profileUrl}
                                    type={type}
                                  />
                                </div>
                              )
                            )}
                          </CardContent>
                        </motion.div>
                      </Card>
                    </div>
                    <div className="col-span-4 md:col-span-3"></div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
