"use client";

import {
   Popover,
   PopoverTrigger,
   PopoverPanel,
} from "@/components/animate-ui/components/base/popover";
import { Button } from "@/components/ui/button";
import {
   Cancel01Icon,
   Menu01Icon,
   Settings01Icon,
   ChatQuestion01Icon,
   ArrowDownIcon,
   Logout01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
   Avatar,
   AvatarBadge,
   AvatarFallback,
   AvatarImage,
} from "@/components/ui/avatar";
import UserMenuSkeleton from "@/components/layouts/user-menu-skeleton";
import { Separator } from "@/components/ui/separator";
import { useSignOut } from "@/features/auth/auth.hook";
import { toast } from "sonner";
import { useGetProfile } from "@/features/profile/profile.hook";

export default function UserMenuClient({ userId }: { userId: string }) {
   const { signOut } = useSignOut();
   const [popoverState, setPopoverState] = useState<boolean>(false);
   const { data: profile, isLoading } = useGetProfile(userId);

   const handleSignOut = () => {
      signOut(undefined, {
         onSuccess: () => {
            toast.success("Sign out successfully");
         },
         onError: (error) => {
            console.log(error);
         },
      });
   };

   if (isLoading && !!userId) return <UserMenuSkeleton />;
   if (!profile) return null;

   return (
      <Popover onOpenChange={(state) => setPopoverState(state)}>
         <PopoverTrigger
            nativeButton={false}
            render={
               profile ? (
                  <Avatar>
                     <AvatarImage src={profile?.avatarUrl ?? ""} />
                     <AvatarFallback>U</AvatarFallback>
                     <AvatarBadge>
                        <HugeiconsIcon icon={ArrowDownIcon} />
                     </AvatarBadge>
                  </Avatar>
               ) : (
                  <Button variant="ghost" size="icon-sm">
                     <HugeiconsIcon
                        icon={popoverState ? Cancel01Icon : Menu01Icon}
                     />
                  </Button>
               )
            }
         />
         <PopoverPanel align="end" className="max-w-max p-0 text-xs">
            <div className="grid gap-0.5">
               <div className="p-1">
                  <Link
                     href={`/profile/${profile?.publicId}`}
                     className="block rounded-lg p-1 px-2 hover:bg-accent"
                  >
                     <div className="flex items-center gap-2">
                        <Avatar>
                           <AvatarImage src={profile?.avatarUrl ?? ""} />
                           <AvatarFallback>U</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 flex-col">
                           <span className="text-sm font-bold">
                              {profile.username ?? "Unknown"}
                           </span>
                           <span className="text-muted-foreground">
                              {profile.username ?? ""}
                           </span>
                        </div>
                     </div>
                  </Link>
               </div>

               <Separator />

               <div className="grid gap-1 p-1">
                  <Link href={"/settings"}>
                     <div className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-accent">
                        <HugeiconsIcon icon={Settings01Icon} size={16} />
                        Settings
                     </div>
                  </Link>
                  <Link href={"/faq-tutorial"}>
                     <div className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-accent">
                        <HugeiconsIcon icon={ChatQuestion01Icon} size={16} />
                        FAQ & Tutorial
                     </div>
                  </Link>

                  <div
                     className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-destructive hover:bg-destructive/10"
                     onClick={handleSignOut}
                  >
                     <HugeiconsIcon icon={Logout01Icon} size={16} />
                     Sign out
                  </div>
               </div>
            </div>
         </PopoverPanel>
      </Popover>
   );
}
