"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Line, Pie } from "react-chartjs-2";
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
import {
  CalendarIcon,
  CircleCheckBig,
  CircleX,
  Clock,
  Ban,
} from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useRecoilValue } from "recoil";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Heading } from "@/components/ui/heading";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { adminAuthState } from "@/states/auth";
import { fetchClinicReport } from "@/pages/api/api";
import { generateColor } from "@/utils/colorGenerator";
import Loading from "@/pages/loading";

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

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Reports", link: "/admin/reports" },
];

const DashboardCard = ({ title, value, icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-lg shadow-md p-6 flex items-center ${color}`}
  >
    <div className="mr-4">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [clinicData, setClinicData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const auth = useRecoilValue(adminAuthState);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -5),
    to: new Date(),
  });

  useEffect(() => {
    const fetchReport = async (token: string) => {
      try {
        setLoading(true);
        const data = await fetchClinicReport(
          { date_from: addDays(new Date(), -20), date_to: new Date() },
          token
        );
        setClinicData(data);
      } catch (error) {
        console.error("Failed to fetch report", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.accessToken) {
      fetchReport(auth.accessToken);
    }
  }, [auth]);

  const handleDateChange = async (
    date_from: Date | undefined,
    date_to: Date | undefined
  ) => {
    setDate({ from: date_from, to: date_to });
    if (date_from && date_to) {
      setLoading(true);
      try {
        setClinicData(
          await fetchClinicReport(
            { date_from: new Date(date_from), date_to: new Date(date_to) },
            auth?.accessToken as string
          )
        );
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16 bg-gray-100">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center justify-between space-y-2">
              <Heading title={`Pet Clinic Report`} />
              <div className="flex flex-row items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[250px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(range) => {
                        setDate(range || { from: undefined, to: undefined });
                        if (range) handleDateChange(range.from, range.to);
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {!loading && clinicData && (
              <ScrollArea className="h-[calc(100vh-220px)] pl-2 pr-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard
                      title="Pending"
                      value={clinicData?.countData?.pending_count}
                      icon={<Clock size={24} />}
                      color="text-yellow-500"
                    />
                    <DashboardCard
                      title="Accepted"
                      value={clinicData?.countData?.accepted_count}
                      icon={<CircleCheckBig size={24} />}
                      color="text-green-500"
                    />
                    <DashboardCard
                      title="Rejected"
                      value={clinicData?.countData?.rejected_count}
                      icon={<CircleX size={24} />}
                      color="text-red-700"
                    />
                    <DashboardCard
                      title="Cancelled"
                      value={clinicData?.countData?.cancelled_count}
                      icon={<Ban size={24} />}
                      color="text-grey-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4">
                      <Card className="w-full max-w-3xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white rounded-lg shadow-md p-6 col-span-2"
                        >
                          <h2 className="text-xl font-semibold mb-4">
                            Appointments by Doctors
                          </h2>
                          <div className="h-[350px] flex items-center justify-center">
                            <Bar
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                              }}
                              data={{
                                labels: clinicData?.barData?.map(
                                  (doctor: any) => doctor.name
                                ),
                                datasets: [
                                  {
                                    label: "Clinic Appointments",
                                    data: clinicData.barData?.map(
                                      (doctor: any) => doctor.count
                                    ),
                                    backgroundColor: clinicData.barData?.map(
                                      (doctor: any) =>
                                        generateColor(doctor.name, 90)
                                    ),
                                  },
                                ],
                              }}
                            />
                          </div>
                        </motion.div>
                      </Card>
                    </div>

                    <div className="col-span-4 md:col-span-3">
                      <Card className="w-full max-w-3xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white rounded-lg shadow-md col-span-2"
                        >
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold">
                              Appointments by Clinics
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="h-[350px] flex items-center justify-center">
                            <Pie
                              data={{
                                labels: clinicData.pieData?.map(
                                  (clinic: any) => clinic.name
                                ),
                                datasets: [
                                  {
                                    data: clinicData.pieData?.map(
                                      (clinic: any) => clinic.count
                                    ),
                                    backgroundColor: clinicData.pieData?.map(
                                      (clinic: any) =>
                                        generateColor(clinic.name, 90)
                                    ),
                                  },
                                ],
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                              }}
                            />
                          </CardContent>
                        </motion.div>
                      </Card>
                    </div>
                  </div>

                  <div className="grid grid-cols-1">
                    <Card className="w-full mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-md"
                      >
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-xl font-semibold">
                            Appointments Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                          <Line
                            data={{
                              labels: clinicData?.lineData?.map((data: any) =>
                                format(data.date, "dd MMM")
                              ),
                              datasets: [
                                {
                                  label: "Appointments",
                                  data: clinicData?.lineData?.map(
                                    (data: any) => data.count
                                  ),
                                  borderColor: "rgb(75, 192, 192)",
                                  tension: 0.1,
                                },
                              ],
                            }}
                            options={{ responsive: true }}
                          />
                        </CardContent>
                      </motion.div>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            )}
            {loading && (
              <div className="h-[calc(100vh-220px)] flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
