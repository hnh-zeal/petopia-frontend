import { fetchDoctors } from "../../api/api";
import type { GetServerSideProps } from "next";
import { DoctorData } from "@/types/api";
import Doctors from "@/components/Layout/Pet Clinic/Doctors";

export const getServerSideProps: GetServerSideProps<{
  doctorsData: DoctorData;
}> = async (context) => {
  try {
    const doctorsData = await fetchDoctors({ isActive: true });
    return { props: { doctorsData } };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      notFound: true,
    };
  }
};

export default function DoctorsPage({
  doctorsData,
}: {
  doctorsData: DoctorData;
}) {
  return <Doctors doctorsData={doctorsData} />;
}
