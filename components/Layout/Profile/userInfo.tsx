import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Smartphone,
  Cat,
  Dog,
  Bird,
} from "lucide-react";
import {
  CafeBooking,
  CareAppointment,
  ClinicAppointment,
  PackageHistory,
  Pet,
  UserDetails,
} from "@/types/api";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { fetchUserByID, updateUserByID } from "@/pages/api/api";

const UserInfo: React.FC<{ user: UserDetails | any }> = ({ user }) => {
  const router = useRouter();
  const auth = useRecoilValue(adminAuthState);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(user.isActive);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserDetails>(user);

  const petIcons = {
    cat: <Cat className="w-4 h-4" />,
    dog: <Dog className="w-4 h-4" />,
    bird: <Bird className="w-4 h-4" />,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateUserByID(
        userData.id,
        auth?.accessToken as string,
        {
          isActive: !isActive,
        }
      );
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
        const user = await fetchUserByID(
          userData.id,
          auth?.accessToken as string
        );
        setUserData(user);
      }
    } finally {
      setLoading(false);
    }
    setIsActive(!isActive);
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br  min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardContent className="flex items-center space-x-6 p-6">
            <div className="w-full md:w-1/6 flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.profileUrl} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full md:w-5/6">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant={userData.isActive ? "success" : "destructive"}>
                  {userData.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {format(new Date(userData.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <Switch
                checked={isActive}
                disabled={loading}
                onCheckedChange={handleStatusToggle}
              />
              <Button
                onClick={() => router.push(`/admin/users/${userData.id}/edit`)}
              >
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal & Pets</TabsTrigger>
            <TabsTrigger value="clinic">Clinic Appointments</TabsTrigger>
            <TabsTrigger value="care">Care Appointments</TabsTrigger>
            <TabsTrigger value="bookings">Cafe Room Bookings</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{`${userData.address}, ${userData.city}, ${userData.country}`}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  <span>
                    Date of Birth:{" "}
                    {format(new Date(userData.birthDate), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-gray-500" />
                  <span>
                    Last login:{" "}
                    {format(
                      new Date(userData.lastLoginDate),
                      "MMMM d, yyyy hh:mm:ss a"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>User&apos;s Pets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.pets?.map((pet: Pet) => (
                    <Card key={pet.id}>
                      <CardContent className="flex items-center space-x-4 p-4">
                        {petIcons[pet.petType as keyof typeof petIcons]}
                        <div>
                          <h3 className="font-semibold">{pet.name}</h3>
                          <p className="text-sm text-gray-500">
                            {pet.breed}, {pet.sex}, {pet.age ?? pet.month}{" "}
                            {pet.age ? "years" : "months"} old
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinic">
            <Card>
              <CardHeader>
                <CardTitle>Clinic Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {userData.clinicAppointments?.map((apt: ClinicAppointment) => (
                  <Card key={apt.id} className="mb-4">
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">
                          {format(new Date(apt.date), "MMMM d, yyyy HH:mm")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {apt.description}
                        </p>
                      </div>
                      <Badge>{apt.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care">
            <Card>
              <CardHeader>
                <CardTitle>Care Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {userData.careAppointments?.map((apt: CareAppointment) => (
                  <Card key={apt.id} className="mb-4">
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">
                          {format(new Date(apt.date), "MMMM d, yyyy HH:mm")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {apt.description}
                        </p>
                      </div>
                      <Badge>{apt.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Room Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {user.bookings?.map((booking: CafeBooking) => (
                  <Card key={booking.id} className="mb-4">
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">
                          {format(new Date(booking.date), "MMMM d, yyyy")}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(booking.startTime), "HH:mm")} -{" "}
                          {format(new Date(booking.endTime), "HH:mm")}
                        </p>
                        <p className="text-sm">Guests: {booking.guests}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${booking.totalPrice}</p>
                        <Badge>{booking.status ? "Booked" : "Pending"}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Package History</CardTitle>
              </CardHeader>
              <CardContent>
                {user.packageHistory?.map((pkg: PackageHistory) => (
                  <Card key={pkg.id} className="mb-4">
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{pkg.package.name}</h3>
                        <p className="text-sm text-gray-500">
                          Expires on{" "}
                          {format(new Date(pkg.expiredDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${pkg.package.price}</p>
                        <p className="text-sm">
                          {pkg.package.duration} {pkg.package.durationType}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default UserInfo;
