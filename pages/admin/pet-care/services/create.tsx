import { Breadcrumbs } from "@/components/breadcrumbs";
import CreateServicesForm from "@/components/Forms/create-services-form";
import Header from "@/components/Layout/header";
import Sidebar from "@/components/Layout/sidebar";
import { fetchCategories } from "@/pages/api/api";
import { Category } from "@/types/api";
import { GetServerSideProps } from "next";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pet Care Services", link: "/admin/pet-care/services" },
  { title: "Create", link: "/admin/pet-care/services/create" },
];

export const getServerSideProps: GetServerSideProps<{
  categories: Category[];
}> = async (context) => {
  try {
    const categoryData = await fetchCategories();
    return { props: { categories: categoryData.categories } };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      notFound: true,
    };
  }
};

export default function CreateServices({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            <CreateServicesForm categories={categories} />
          </div>
        </main>
      </div>
    </>
  );
}
