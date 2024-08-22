import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import { RecoilRoot } from "recoil";
import Footer from "@/components/Layout/footer";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <>
      <RecoilRoot>
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
      </RecoilRoot>
    </>
  );
}
