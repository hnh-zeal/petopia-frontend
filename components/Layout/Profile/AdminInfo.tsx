"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";
import { format } from "date-fns";
import { Admin } from "@/types/api";
import { useRouter } from "next/router";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { updateAdminByID } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";

export default function AdminInfo({ admin }: { admin: Admin }) {
  const router = useRouter();
  const auth = useRecoilValue(adminAuthState);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(admin);
  const [isActive, setIsActive] = useState(admin.isActive);

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateAdminByID(
        admin.id,
        {
          isActive: !isActive,
        },
        auth?.accessToken as string
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
        setAdminData(data.data);
      }
    } finally {
      setLoading(false);
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardContent className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 p-6">
            <div className="w-full md:w-1/6 flex justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={admin.profileUrl || "/default-admin.png"}
                  alt={admin.name}
                  className="object-cover"
                />
                <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full md:w-4/6">
              <h1 className="text-3xl font-bold text-black">{admin.name}</h1>
              <div className="flex flex-wrap items-center mt-2 space-x-4">
                <Badge
                  variant={isActive ? "success" : "destructive"}
                  className="mb-2 md:mb-0"
                >
                  {adminData.isActive ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-black">
                  Member since{" "}
                  {admin.createdAt
                    ? format(new Date(admin.createdAt), "MMM d, yyyy HH:mm a")
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="w-full md:w-1/6 flex items-center justify-between">
              <Switch
                checked={adminData.isActive}
                disabled={loading}
                onCheckedChange={handleStatusToggle}
              />
              <Button
                onClick={() => router.push(`/admin/admins/${admin.id}/edit`)}
                className="bg-black hover:bg-black"
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Tab */}
        <Card className="p-2 my-6">
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold flex items-center text-black-800">
                  <User className="mr-2" /> About
                </h3>
                <p className="text-black-700 text-pretty">
                  {admin.about || "No information provided."}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold flex items-center text-black-800">
                  Contact Information
                </h3>
                <p className="text-black-700 text-pretty flex items-center">
                  <Mail className="mr-2" /> {admin.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-black-800">Role</h3>
                <p className="text-black-700">{admin.role}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-black-800">
                  Last Login Date
                </h3>
                <p className="text-black-700">
                  {admin.lastLoginDate
                    ? format(
                        new Date(admin.lastLoginDate),
                        "MMMM d, yyyy HH:mm"
                      )
                    : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
