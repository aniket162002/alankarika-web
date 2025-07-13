"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LogoLoader from "@/components/ui/LogoLoader";

export default function RouteLoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true); // Start as true for initial load
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    // On first mount, show loader for 1.5s
    if (firstLoad.current) {
      const initialTimeout = setTimeout(() => setLoading(false), 1500);
      firstLoad.current = false;
      return () => clearTimeout(initialTimeout);
    }
    // On route change, show loader briefly
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700); // 0.7s for route transitions
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <LogoLoader show={loading} />
      {children}
    </>
  );
} 