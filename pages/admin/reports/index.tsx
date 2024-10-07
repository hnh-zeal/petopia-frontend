import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Packages, PackagesData } from "@/types/api";
import { fetchPackages } from "@/pages/api/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Reports", link: "/admin/reports" },
];

export const getStaticProps = (async () => {
  const packagesData = await fetchPackages({});
  return { props: { packagesData } };
}) satisfies GetStaticProps<{
  packagesData: PackagesData;
}>;

import React, { useState } from "react";
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
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Clipboard,
  Coffee,
  Syringe,
  Scissors,
  Dog,
  CalendarIcon,
} from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

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
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 22000, 18000, 24000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const serviceDistributionData = {
    labels: [
      "Clinic Visits",
      "Grooming",
      "Pet Sitting",
      "Training",
      "Cafe Bookings",
    ],
    datasets: [
      {
        data: [300, 150, 100, 80, 200],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const petTypeData = {
    labels: ["Dogs", "Cats", "Birds", "Small Pets"],
    datasets: [
      {
        label: "Pet Types",
        data: [450, 300, 100, 150],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  };

  const [date, setDate] = useState<Date | undefined>(new Date());
  const handleDateChange = async (date: Date | undefined) => {
    if (date) {
      setDate(date);
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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
          </div>

          <ScrollArea className="h-[calc(100vh-220px)] pl-2 pr-5">
            <div className=" bg-gray-100 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard
                  title="Total Appointments"
                  value="1,234"
                  icon={<CalendarDays size={24} />}
                  color="text-blue-600"
                />
                <DashboardCard
                  title="Active Clients"
                  value="567"
                  icon={<Users size={24} />}
                  color="text-green-600"
                />
                <DashboardCard
                  title="Monthly Revenue"
                  value="$45,678"
                  icon={<DollarSign size={24} />}
                  color="text-yellow-600"
                />
                <DashboardCard
                  title="Growth Rate"
                  value="12.3%"
                  icon={<TrendingUp size={24} />}
                  color="text-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
                  <Line data={revenueData} options={{ responsive: true }} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Service Distribution
                  </h2>
                  <Pie
                    data={serviceDistributionData}
                    options={{ responsive: true }}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6 col-span-2"
                >
                  <h2 className="text-xl font-semibold mb-4">Pet Types</h2>
                  <Bar data={petTypeData} options={{ responsive: true }} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Clipboard className="mr-2 text-blue-500" />
                      <span>23 Appointments Today</span>
                    </li>
                    <li className="flex items-center">
                      <Coffee className="mr-2 text-yellow-500" />
                      <span>5 Cafe Rooms Booked</span>
                    </li>
                    <li className="flex items-center">
                      <Syringe className="mr-2 text-red-500" />
                      <span>15 Vaccinations Scheduled</span>
                    </li>
                    <li className="flex items-center">
                      <Scissors className="mr-2 text-green-500" />
                      <span>8 Grooming Sessions</span>
                    </li>
                    <li className="flex items-center">
                      <Dog className="mr-2 text-purple-500" />
                      <span>12 Pet Training Classes</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
