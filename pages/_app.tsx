import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import { RecoilRoot } from "recoil";
import Footer from "@/components/Layout/footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Petopia",
  description: "Learn more about us and what we do.",
};

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <>
      <RecoilRoot>
        <Head>
          <title>Petopia - Your Pet Companion</title>
          <link rel="icon" href="/logo.ico" sizes="any" />
        </Head>
        {/* <ScrollArea className="h-[calc(100vh)]"> */}
        {!isAdminRoute && Component.displayName !== "notFound" && (
          <main className={inter.className}>
            <Navbar />
          </main>
        )}
        <Component {...pageProps} />
        {!isAdminRoute && Component.displayName !== "notFound" && (
          <main className={inter.className}>
            <Footer />
          </main>
        )}
        <Toaster />
        {/* </ScrollArea> */}
      </RecoilRoot>
    </>
  );
}
