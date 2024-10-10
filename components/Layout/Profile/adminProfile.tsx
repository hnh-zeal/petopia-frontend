"use client";
import { Heading } from "../../ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ScrollArea } from "../../ui/scroll-area";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { formatDate } from "date-fns";
import { useRouter } from "next/router";

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const auth = useRecoilValue(adminAuthState);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Profile" />
        <Button onClick={() => router.push("/admin/profile/edit")}>Edit</Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] pr-4">
        <Card className="my-3">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar className="mr-4 h-20 w-20">
                <AvatarImage
                  src={auth?.admin.profileUrl}
                  alt="Profile Picture"
                />
                <AvatarFallback>Admin</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{auth?.admin.name}</h2>
                <p className="text-gray-600">
                  Last Login on{" "}
                  {formatDate(
                    auth?.admin.lastLoginDate ?? "",
                    "dd MMM yyyy, HH:mm a"
                  )}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Tabs defaultValue="personal-info">
          <TabsList>
            <TabsTrigger value="personal-info">
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          <TabsContent value="personal-info">
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="font-bold">Name</p>
                    <p>{auth?.admin?.name}</p>
                  </div>
                  <div>
                    <p className="font-bold">Email</p>
                    <p>{auth?.admin?.email}</p>
                  </div>
                  <div>
                    <p className="font-bold">Role</p>
                    <p>{auth?.admin.isActive || "09420888219"}</p>
                  </div>
                  <div>
                    <p className="font-bold">Address</p>
                    <p></p>
                  </div>
                </div>
                <Separator />
                <div className="my-4">
                  <h3 className="text-lg font-bold">About</h3>
                  <p className="text-gray-600">{auth?.admin.about}</p>
                </div>
                <Separator />
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Experience</h3>
                  <p className="text-gray-600">
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And
                    Typesetting Industry. Lorem Ipsum Has Been The Industry
                    Standard Dummy Text Ever Since The 1500s, When An Unknown
                    Printer Took A Galley Of Type And Scrambled It To Make A
                    Type Specimen Book. It Has Survived Not Only Five Centuries,
                    But Also The Leap Into Electronic Typesetting, Remaining
                    Essentially Unchanged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="permissions">
            <Card>
              <CardContent>
                <div className="my-4">
                  <h3 className="text-lg font-bold">Permissions</h3>
                  <p className="text-gray-600">{auth?.admin.about}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="font-bold">Name</p>
                    <p>{auth?.admin?.name}</p>
                  </div>
                  <div>
                    <p className="font-bold">Email</p>
                    <p>{auth?.admin?.email}</p>
                  </div>
                  <div>
                    <p className="font-bold">Role</p>
                    <p>{auth?.admin.isActive || "09420888219"}</p>
                  </div>
                  <div>
                    <p className="font-bold">Address</p>
                    <p></p>
                  </div>
                </div>
                <Separator />
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Experience</h3>
                  <p className="text-gray-600">
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And
                    Typesetting Industry. Lorem Ipsum Has Been The Industry
                    Standard Dummy Text Ever Since The 1500s, When An Unknown
                    Printer Took A Galley Of Type And Scrambled It To Make A
                    Type Specimen Book. It Has Survived Not Only Five Centuries,
                    But Also The Leap Into Electronic Typesetting, Remaining
                    Essentially Unchanged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="appointments">
            <Card>
              <CardContent>
                <div className="my-4">
                  <h3 className="text-lg font-bold">Permissions</h3>
                  <p className="text-gray-600">{auth?.admin.about}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="font-bold">Name</p>
                    <p>{auth?.admin?.name}</p>
                  </div>
                  <div>
                    <p className="font-bold">Email</p>
                    <p>{auth?.admin?.email}</p>
                  </div>
                  <div>
                    <p className="font-bold">Role</p>
                    <p>{auth?.admin.isActive || "09420888219"}</p>
                  </div>
                  <div>
                    <p className="font-bold">Address</p>
                    <p></p>
                  </div>
                </div>
                <Separator />
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Experience</h3>
                  <p className="text-gray-600">
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And
                    Typesetting Industry. Lorem Ipsum Has Been The Industry
                    Standard Dummy Text Ever Since The 1500s, When An Unknown
                    Printer Took A Galley Of Type And Scrambled It To Make A
                    Type Specimen Book. It Has Survived Not Only Five Centuries,
                    But Also The Leap Into Electronic Typesetting, Remaining
                    Essentially Unchanged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </>
  );
}
