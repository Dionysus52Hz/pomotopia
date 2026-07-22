"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const emptySubcribe = () => () => {};
function ActiveLink({
   href,
   activeClass,
   className,
   children,
}: {
   href: string;
   activeClass?: string;
   className?: string;
   children: React.ReactNode;
}) {
   const pathname = usePathname();
   const mounted = useSyncExternalStore(
      emptySubcribe,
      () => true,
      () => false
   );
   const isActive = mounted && pathname === href;

   return (
      <Link href={href} className={cn(className, isActive ? activeClass : "")}>
         {children}
      </Link>
   );
}

export { ActiveLink };
