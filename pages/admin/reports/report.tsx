"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  CalendarDays,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Coffee,
  Syringe,
  Scissors,
  Dog,
  Clipboard,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReportSection = ({ title, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-md p-6 mb-8"
  >
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    {children}
  </motion.div>
);

const Report = () => {
  const monthlyAppointmentsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Clinic Visits",
        data: [300, 350, 320, 380, 400, 450],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Grooming",
        data: [150, 180, 160, 200, 220, 240],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Pet Sitting",
        data: [100, 120, 110, 130, 140, 150],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const cafeBookingsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Cafe Bookings",
        data: [15, 20, 18, 25, 30, 40, 35],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-800 mb-8"
      >
        Pet Care Business Report
      </motion.h1>

      <ReportSection title="Monthly Service Breakdown">
        <Bar data={monthlyAppointmentsData} options={{ responsive: true }} />
      </ReportSection>

      <ReportSection title="Cafe Bookings (Last Week)">
        <Line data={cafeBookingsData} options={{ responsive: true }} />
      </ReportSection>

      <ReportSection title="Key Performance Indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CalendarDays className="mr-2 text-blue-600" />
              <h3 className="font-semibold">Appointment Completion Rate</h3>
            </div>
            <p className="text-2xl font-bold">95%</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="mr-2 text-green-600" />
              <h3 className="font-semibold">Customer Retention Rate</h3>
            </div>
            <p className="text-2xl font-bold">87%</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="mr-2 text-yellow-600" />
              <h3 className="font-semibold">Average Response Time</h3>
            </div>
            <p className="text-2xl font-bold">2.5 hours</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="mr-2 text-purple-600" />
              <h3 className="font-semibold">Customer Satisfaction Score</h3>
            </div>
            <p className="text-2xl font-bold">4.8/5</p>
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Service Details">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Service</th>
                <th className="py-2 px-4 text-left">Total Appointments</th>
                <th className="py-2 px-4 text-left">Revenue</th>
                <th className="py-2 px-4 text-left">Avg. Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4">Clinic Visits</td>
                <td className="py-2 px-4">450</td>
                <td className="py-2 px-4">$22,500</td>
                <td className="py-2 px-4">45 mins</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Grooming</td>
                <td className="py-2 px-4">240</td>
                <td className="py-2 px-4">$9,600</td>
                <td className="py-2 px-4">1.5 hours</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Pet Sitting</td>
                <td className="py-2 px-4">150</td>
                <td className="py-2 px-4">$7,500</td>
                <td className="py-2 px-4">4 hours</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Training</td>
                <td className="py-2 px-4">80</td>
                <td className="py-2 px-4">$6,400</td>
                <td className="py-2 px-4">1 hour</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Cafe Bookings</td>
                <td className="py-2 px-4">200</td>
                <td className="py-2 px-4">$4,000</td>
                <td className="py-2 px-4">2 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ReportSection>

      <ReportSection title="Top Performing Services">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-2">
              <Syringe className="mr-2 text-blue-600" />
              <h3 className="font-semibold">Vaccinations</h3>
            </div>
            <p className="text-lg">Revenue: $15,000</p>
            <p className="text-sm text-gray-600">150 appointments</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-2">
              <Scissors className="mr-2 text-green-600" />
              <h3 className="font-semibold">Grooming - Full Service</h3>
            </div>
            <p className="text-lg">Revenue: $12,000</p>
            <p className="text-sm text-gray-600">120 appointments</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-2">
              <Dog className="mr-2 text-yellow-600" />
              <h3 className="font-semibold">Obedience Training</h3>
            </div>
            <p className="text-lg">Revenue: $9,000</p>
            <p className="text-sm text-gray-600">60 appointments</p>
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Areas for Improvement">
        <ul className="list-disc list-inside space-y-2">
          <li>
            Increase marketing efforts for pet sitting services to boost
            appointments
          </li>
          <li>
            Optimize scheduling for grooming services to reduce wait times
          </li>
          <li>
            Introduce new specialty services in the clinic to attract more
            customers
          </li>
          <li>
            Enhance the cafe menu to encourage longer stays and higher spending
          </li>
          <li>
            Implement a loyalty program to improve customer retention rates
          </li>
        </ul>
      </ReportSection>

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
  );
};

export default Report;
