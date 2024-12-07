import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import AdminInfo from "@/components/Layout/Profile/AdminInfo";
import Sidebar from "@/components/Layout/sidebar";
import { useFetchDetails } from "@/hooks/useFetchDetails";
import { fetchAdminByID } from "@/pages/api/api";
import Loading from "@/pages/loading";
import { adminAuthState } from "@/states/auth";
import { Admin } from "@/types/api";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

const breadcrumbItems = (admin: Admin) => [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Admins", link: "/admin/admins" },
  { title: `${admin.name}`, link: "/admin/admins" },
];

export default function EditAdmin() {
  const router = useRouter();
  const adminAuth = useRecoilValue(adminAuthState);
  const { id } = router.query;

  const { data, loading, error } = useFetchDetails(
    fetchAdminByID,
    id as string,
    adminAuth?.accessToken
  );

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            {loading ? (
              <div className="flex items-center justify-center h-[calc(100vh-220px)]">
                <Loading />
              </div>
            ) : (
              <>
                <Breadcrumbs items={breadcrumbItems(data)} />
                <AdminInfo admin={data} />
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
