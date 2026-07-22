import * as React from "react";
import { Settings } from "@/features/settings/components/settings";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { authenticate } from "@/features/auth/auth.helper";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
   const supabase = await getSupabaseServerClient();

   const [user, authenticateError] = await authenticate(supabase);
   if (!user || authenticateError) {
      redirect("/signin");
   }

   return (
      <div className="flex h-[calc(100dvh-56px)] flex-col items-center justify-center bg-background">
         <Settings userId={user.id} />
      </div>
   );
}
