"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalHeaderFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrAuth =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/forgot-password");

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
