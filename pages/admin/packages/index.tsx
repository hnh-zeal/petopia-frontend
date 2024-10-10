import { Breadcrumbs } from "@/components/breadcrumbs";
import { PackagesData } from "@/types/api";
import { fetchPackages } from "@/pages/api/api";
import {
  GetServerSideProps,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import PackagesCards from "@/components/Layout/packages-cards";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Packages", link: "/admin/packages" },
];

export const getServerSideProps: GetServerSideProps<{
  packagesData: PackagesData;
}> = async (context) => {
  try {
    const packagesData = await fetchPackages({});
    return { props: { packagesData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function PackagesPage({
  packagesData,
}: {
  packagesData: PackagesData;
}) {
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
