import Head from "next/head";
import LandingPage from "@/components/Layout/Home/landing";
import Services from "@/components/Layout/Home/services";
import PetCareServices from "@/components/Layout/Home/care-services";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Petopia</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <main>
        <LandingPage />
        <Services />
        <PetCareServices />
      </main>
    </div>
  );
}
