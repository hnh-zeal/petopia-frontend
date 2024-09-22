import { Breadcrumbs } from "@/components/breadcrumbs";
import { PackagesData } from "@/types/api";
import { fetchPackages } from "@/pages/api/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import PackagesCards from "@/components/Layout/packages-cards";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Packages", link: "/admin/packages" },
];

export const getStaticProps = (async () => {
  const packagesData = await fetchPackages({});
  return { props: { packagesData } };
}) satisfies GetStaticProps<{
  packagesData: PackagesData;
}>;

export default function PackagesPage({
  packagesData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <PackagesCards packagesData={packagesData} />
          </div>
          <div>
            <Toaster />
          </div>
        </main>
      </div>
    </>
  );
}
