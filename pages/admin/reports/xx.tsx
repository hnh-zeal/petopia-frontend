import React from "react";
import {
  CalendarDays,
  UserPlus,
  UserCheck,
  FileText,
  ChevronRight,
  Clock,
} from "lucide-react";

const SummaryCard = ({ icon, title, count, color }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
    <div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{count}</p>
    </div>
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
  </div>
);

const AppointmentItem = ({ time, name, condition }) => (
  <div className="flex items-center mb-4">
    <div className="w-16 text-sm text-gray-500">{time}</div>
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

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={<CalendarDays className="text-white" />}
          title="Appointments"
          count="46"
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<UserPlus className="text-white" />}
          title="New Patients"
          count="129"
          color="bg-red-500"
        />
        <SummaryCard
          icon={<UserCheck className="text-white" />}
          title="Follow-Up Patients"
          count="92"
          color="bg-yellow-500"
        />
        <SummaryCard
          icon={<FileText className="text-white" />}
          title="Review Reports"
          count="118"
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <CalendarDays className="mr-2 text-blue-500" />
              Today Appointments
            </h2>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              ATTENDED APPOINTMENTS
            </h3>
            <div className="flex mb-2">
              <div className="flex-grow">
                <p className="text-sm">New Patients</p>
                <div className="h-2 bg-blue-100 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <p className="text-sm ml-2">3/29</p>
            </div>
            <div className="flex">
              <div className="flex-grow">
                <p className="text-sm">Follow-Up Patients</p>
                <div className="h-2 bg-blue-100 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
              <p className="text-sm ml-2">0/17</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">APPOINTMENT</h3>
              <a href="#" className="text-sm text-blue-500">
                View All
              </a>
            </div>
            <AppointmentItem
              time="08.00"
              name="Kristin Watson"
              condition="Stomach Pain"
            />
            <AppointmentItem
              time="09.00"
              name="Jerome Bell"
              condition="Headache"
            />
            <AppointmentItem
              time="10.00"
              name="Dianne Russell"
              condition="Gerd"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Clock className="mr-2 text-blue-500" />
              On Going Appointments
            </h2>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div>
              <h3 className="font-bold">Brooklyn Simmons</h3>
              <p className="text-sm text-gray-500">
                Regular Patient • On Consultation
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">REFERRING DOCTOR</p>
              <p className="font-medium">Dr. Joseph Carla</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ASSIGNED DOCTOR</p>
              <p className="font-medium">Dr. Kim Lee</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">RAMQ</p>
              <p className="font-medium">STESS 3455 6665</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">OCCUPATION</p>
              <p className="font-medium">Designer</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">EXPIRED DATE</p>
              <p className="font-medium">12/07/2023</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">DETAILS</p>
              <p className="font-medium">Male, 29 Yrs</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">SPECIAL NOTES</p>
            <p className="text-sm">
              Stomach feel like roller coaster evertime.
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">ADDRESS</p>
            <p className="text-sm">
              795 Ave Rockland, Outremont, Montreal, Canada
            </p>
          </div>
          <p className="text-sm text-gray-500">
            <Clock size={16} className="inline mr-1" />
            You can report any issue.{" "}
            <a href="#" className="text-blue-500">
              Report here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
