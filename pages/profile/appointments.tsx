import { ClinicAppointmentClient } from "@/components/Tables/clinic-appointment-tables/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyAppointments() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      <Tabs defaultValue="clinic">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="clinic">Pet Clinic</TabsTrigger>
          <TabsTrigger value="care">Pet Care</TabsTrigger>
          <TabsTrigger value="cafe">Pet Cafe</TabsTrigger>
        </TabsList>

        {/* Pet Clinic Tab Content */}
        <TabsContent value="clinic">
          <div className="flex flex-col gap-5">
            <ClinicAppointmentClient isAdmin={false} />
          </div>
        </TabsContent>

        {/* Pet Care Tab Content */}
        <TabsContent value="care">
          {/* <DataTable
            data={careBookings}
            columns={[
              { header: "Service", accessor: "service" },
              { header: "Provider", accessor: "provider" },
              { header: "Date", accessor: "date" },
              { header: "Time", accessor: "time" },
              {
                header: "Actions",
                accessor: (row) => (
                  <button className="text-blue-500">Cancel Appointment</button>
                ),
              },
            ]}
          /> */}
        </TabsContent>

        {/* Pet Cafe Tab Content */}
        <TabsContent value="cafe">
          {/* <DataTable
            data={cafeBookings}
            columns={[
              { header: "Pet Name", accessor: "petName" },
              { header: "Room", accessor: "room" },
              { header: "Date", accessor: "date" },
              { header: "Time", accessor: "time" },
              {
                header: "Actions",
                accessor: (row) => (
                  <button className="text-blue-500">Cancel Appointment</button>
                ),
              },
            ]}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
