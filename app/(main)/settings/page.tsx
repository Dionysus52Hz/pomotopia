import * as React from "react";
import { Settings } from "@/features/settings/components/settings";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { authenticate } from "@/features/auth/auth.helper";
import { notFound, redirect } from "next/navigation";
import { getUserProfile } from "@/features/profile/profile.service";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";

export default async function SettingsPage() {
   const supabase = await getSupabaseServerClient();

   const [user, authenticateError] = await authenticate(supabase);
   if (!user || authenticateError) {
      redirect("/signin");
   }

   const [profile, errors] = await getUserProfile(supabase, {
      publicId: user.id,
   });
   if (errors) {
      if (
         errors.some(
            (error) =>
               error.code === PROFILE_ERRORS.business.USER_NOT_FOUND.code
         )
      ) {
         notFound();
      }
      throw new Error(errors[0].message);
   }

   return (
      <div className="flex h-[calc(100dvh-56px)] w-full flex-col items-center justify-center bg-background">
         <Settings userId={user.id} initialProfile={profile} />
      </div>
   );
}
