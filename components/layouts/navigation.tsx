import {
   NavigationMenu,
   NavigationMenuList,
   NavigationMenuItem,
   NavigationMenuLink,
   navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
   Home01Icon,
   StickyNote01Icon,
   UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { ActiveLink } from "@/components/ui/active-link";

export default function Navigation() {
   const activeClass = "text-red-500";
   return (
      <div className="fixed bottom-0 w-dvw p-3">
         <div className="flex w-full items-center justify-center">
            <NavigationMenu className="rounded-lg border p-2">
               <NavigationMenuList>
                  <NavigationMenuItem>
                     <NavigationMenuLink
                        render={
                           <ActiveLink href="/tasks" activeClass={activeClass}>
                              <span className="flex flex-col items-center gap-2">
                                 <HugeiconsIcon icon={StickyNote01Icon} />
                                 Tasks
                              </span>
                           </ActiveLink>
                        }
                     />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                     <NavigationMenuLink
                        render={
                           <ActiveLink href="/" activeClass={activeClass}>
                              <span className="flex flex-col items-center gap-2">
                                 <HugeiconsIcon icon={Home01Icon} />
                                 Home
                              </span>
                           </ActiveLink>
                        }
                     />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                     <NavigationMenuLink
                        render={
                           <ActiveLink
                              href="/profile/1"
                              activeClass={activeClass}
                           >
                              <span className="flex flex-col items-center gap-2">
                                 <HugeiconsIcon icon={UserAccountIcon} />
                                 Profile
                              </span>
                           </ActiveLink>
                        }
                     />
                  </NavigationMenuItem>
               </NavigationMenuList>
            </NavigationMenu>
         </div>
      </div>
   );
}
