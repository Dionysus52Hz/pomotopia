import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/i18n/language-switcher";
import Link from "next/link";
import {
   RippleButton,
   RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";

export default function IntroduceNavbar() {
   return (
      <nav className="app-bar bg- fixed top-0 z-50 h-15 w-dvw border bg-background">
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

               <RippleButton rounded="full">
                  <Link href="/sign-in">Sign in</Link>
                  <RippleButtonRipples />
               </RippleButton>
            </div>
         </div>
      </nav>
   );
}
