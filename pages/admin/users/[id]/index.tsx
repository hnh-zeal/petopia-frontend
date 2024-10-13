import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { useRouter } from "next/router";
import { fetchUserByID } from "@/pages/api/api";
import { UserDetails } from "@/types/api";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import UserInfo from "@/components/Layout/Profile/UserInfo";
import Loading from "@/pages/loading";

const breadcrumbItems = (user: UserDetails | undefined) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Users", link: "/admin/users" },
  { title: user ? user.name : "Loading...", link: "/admin/users" },
];

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const auth = useRecoilValue(adminAuthState);
  const [userData, setUserData] = useState<UserDetails>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const getUser = async () => {
        try {
          const data = await fetchUserByID(
            Number(id),
            auth?.accessToken as string
          );
          setUserData(data); // Directly set the user data
        } catch (error) {
          console.error("Failed to fetch User", error);
        } finally {
          setLoading(false);
        }
      };

      getUser();
    }
  }, [id, auth]);

  if (!id) return null;

  return (
    <>
      {id && (
        <>
          <Header />
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden pt-16">
              <div className="flex-1 space-y-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems(userData)} />
                <ScrollArea className="h-[calc(100vh-120px)]">
                  {!loading && userData ? (
                    <UserInfo user={userData} />
                  ) : (
                    <div className="flex items-center justify-center h-[calc(100vh-220px)]">
                      <Loading />
                    </div>
                  )}
                </ScrollArea>
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
}
