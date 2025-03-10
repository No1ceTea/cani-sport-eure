"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const adminCookie = cookies.find((row) => row.startsWith("administrateur="));
    const isAdmin = adminCookie ? adminCookie.split("=")[1] === "true" : false;

    if (!isAdmin) {
      router.push("/unauthorized");
    }
  }, []);

  return <>{children}</>;
}
