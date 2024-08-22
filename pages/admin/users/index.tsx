import { Breadcrumbs } from "@/components/breadcrumbs";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { UserClient } from "@/components/Tables/user-tables/client";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Users", link: "/dashboard/users" },
];

export default function Users() {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <UserClient />
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
