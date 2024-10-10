import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { Line, Pie } from "react-chartjs-2";
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
import { GetStaticProps } from "next";
import { months } from "@/constants/data";

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

export const getStaticProps = (async () => {
  const overviewData = await fetchOverviewReport({ date: new Date() });
  const pieData = await fetchPieData({ month: 10, year: 2024 });
  return { props: { overviewData, pieData } };
}) satisfies GetStaticProps<{
  overviewData: OverviewData;
  pieData: PieData;
}>;

const AppointmentItem = ({ date, name, condition }: any) => (
  <div className="flex items-center mb-4">
    <div className="w-16 text-sm text-gray-500">{format(date, "HH:mm a")}</div>
    <div className="flex-grow flex items-center">
      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{condition}</p>
      </div>
    </div>
    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
      <ChevronRight size={16} className="text-green-600" />
    </div>
  </div>
);

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
  const [countData, setCountData] = useState<any>(overviewData.count);
  const [appointments, setAppointments] = useState<any>(
    overviewData.appointments?.clinicAppointments
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

    setSelectedMonth(monthIndex); // Update selected month

    // Fetch new pie data based on the selected month and year
    try {
      const fetchedPieData = await fetchPieData({
        month: monthIndex,
        year: 2024,
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
        setAppointments(overviewData.appointments?.clinicAppointments);
        break;
      case "care":
        setAppointments(overviewData.appointments?.careAppointments);
        break;
      case "cafe":
        setAppointments(overviewData.appointments?.cafeBookings);
        break;
    }
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      setLoading(true);
      setDate(date);
      try {
        const fetchedOverview = await fetchOverviewReport({ date });
        setCountData(fetchedOverview.count);
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
                            +{countData.clinic_count}
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
                            +{countData.care_count}
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
                            +{countData.cafe_count}
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
                            +{countData.user_count}
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
                            <div className="h-[350px] flex items-center justify-center">
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
                                onClick={() =>
                                  router.push(`/admin/pet-${type}/appointments`)
                                }
                                className="text-sm text-blue-500"
                              >
                                View All
                              </Button>
                            </div>

                            {appointments?.map(
                              (appointment: any, i: number) => (
                                <div key={i}>
                                  <AppointmentItem
                                    date={
                                      appointment?.startTime || appointment.date
                                    }
                                    name={appointment.userId}
                                    condition={appointment.description}
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
