"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoLoader from "@/components/ui/LogoLoader";

export default function RouteLoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true); // Start as true for initial load
  const router = useRouter();

  useEffect(() => {
    // Show loader for 1.5s on initial mount
    const initialTimeout = setTimeout(() => setLoading(false), 1500);

    let routeTimeout: NodeJS.Timeout;
    const handleStart = () => {
      routeTimeout = setTimeout(() => setLoading(true), 120);
    };
    const handleStop = () => {
      clearTimeout(routeTimeout);
      setLoading(false);
    };
    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleStop);
    router.events?.on("routeChangeError", handleStop);
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(routeTimeout);
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleStop);
      router.events?.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <>
      <LogoLoader show={loading} />
      {children}
    </>
  );
} 