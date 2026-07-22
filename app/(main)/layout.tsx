import MainNavbar from "@/components/layouts/main-navbar";
import Navigation from "@/components/layouts/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { COMMON_ERRORS } from "@/constants/common-errors";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";
import { getUserProfile } from "@/features/profile/profile.service";
import { AppError } from "@/lib/api/error";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

export default async function MainLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const queryClient = new QueryClient();
   const supabase = await getSupabaseServerClient();

   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (user) {
      await queryClient.prefetchQuery({
         queryKey: [QUERY_KEYS.USER_PROFILE, user.id],
         queryFn: async () => {
            const [data, error] = await getUserProfile(supabase, {
               publicId: user.id,
            });
            if (error) {
               throw [
                  AppError.convertToAppError({
                     ...PROFILE_ERRORS.business.USER_NOT_FOUND,
                  }),
               ];
            }
            return data;
         },
      });
   }
   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="flex h-dvh w-screen flex-col overflow-hidden">
            <MainNavbar />

            <main className="min-h-0 w-full flex-1">
               <ScrollArea className="h-full w-full">
                  <div className="pt-14">{children}</div>
                  <ScrollBar />
               </ScrollArea>
            </main>

            <Navigation />
         </div>
      </HydrationBoundary>
   );
}
