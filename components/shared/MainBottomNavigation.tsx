"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAVIGATION } from "@/constants/ui";

export default function MainBottomNavigation() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <nav
      aria-label="Điều hướng di động"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t p-4 sm:hidden"
    >
      {APP_NAVIGATION.map((item) => (
        <Link
          key={item.key}
          href={item.url}
          aria-current={pathname === item.url ? "page" : undefined}
          className={
            pathname === item.url ? "font-bold text-main-blog" : "text-gray-600"
          }
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
