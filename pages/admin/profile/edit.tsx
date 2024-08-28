import { Breadcrumbs } from "@/components/breadcrumbs";
import AdminProfile from "@/components/Layout/Profile/adminProfile";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Profile", link: "/admin/profile" },
];

export default function Profile() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-[calc(80vh-220px)]">
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
              <Breadcrumbs items={breadcrumbItems} />
              <AdminProfile />
            </div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
