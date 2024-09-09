import Head from "next/head";
import LandingPage from "@/components/Layout/Home/landing";
import Services from "@/components/Layout/Home/services";
import Footer from "@/components/Layout/footer";
import PetCareServices from "@/components/Layout/Home/care-services";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Petopia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LandingPage />
        <Services />
        <PetCareServices />
      </main>
    </div>
  );
}
