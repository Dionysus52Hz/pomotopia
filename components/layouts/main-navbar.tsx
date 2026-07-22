import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import UserMenu from "@/components/layouts/user-menu";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function MainNavbar() {
   const supabase = await getSupabaseServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   return (
      <nav
         data-slot="main-navbar"
         className="fixed top-0 z-50 w-dvw border-b bg-background"
      >
         <div className="flex h-full w-full items-center justify-between p-3">
            <div>Logo</div>

            <div className="flex items-center gap-2">
               <ThemeTogglerButton
                  size="xs"
                  className="rounded-full shadow-none"
                  variant="outline"
                  modes={["dark", "light"]}
               />
               <LanguageSwitcher />
               <UserMenu userId={user!.id} />
            </div>
         </div>
      </nav>
   );
}
