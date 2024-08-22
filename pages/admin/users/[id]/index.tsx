import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import UserInfo from "@/components/userInfo";
import { useRouter } from "next/router";
import { User } from "@/constants/data";
import { fetchUserByID } from "@/pages/api/api";

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const data = await fetchUserByID(Number(id));
        setUserData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch User", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  if (!id) return null;

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Users", link: "/admin/users" },
    { title: `${userData?.name}`, link: "/admin/users" },
  ];

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <ScrollArea className="h-[calc(100vh-220px)]">
              <UserInfo user={userData} />
            </ScrollArea>
          </div>
        </main>
      </div>
    </>
  );
}
