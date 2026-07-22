"use client";

import { useGetStats } from "@/features/profile/profile.hook";

export function UserStats() {
   const { data: stats, isLoading } = useGetStats(publicId);
   return {};
}
