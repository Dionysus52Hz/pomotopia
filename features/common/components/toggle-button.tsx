"use client";

import { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Button as ButtonPrimitive } from "@base-ui/react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import {
   Tooltip,
   TooltipPanel,
   TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";

interface ToggleButtonProps extends Omit<
   ButtonPrimitive.Props & VariantProps<typeof buttonVariants>,
   "children"
> {
   pressed: boolean;
   onStateChange: () => void;
   activeIcon: ReactNode;
   inactiveIcon: ReactNode;
   labelActive: string;
   labelInactive: string;
}

export function ToggleButton({
   pressed,
   onStateChange,
   activeIcon,
   inactiveIcon,
   labelActive,
   labelInactive,
   className,
   variant = "ghost",
   size = "icon-sm",
   ...props
}: ToggleButtonProps) {
   return (
      <Tooltip>
         <TooltipTrigger
            render={
               <Button
                  type="button"
                  variant={variant}
                  size={size}
                  onClick={onStateChange}
                  aria-label={pressed ? labelActive : labelInactive}
                  className={cn("select-none", className)}
                  {...props}
               >
                  {pressed ? activeIcon : inactiveIcon}
               </Button>
            }
         ></TooltipTrigger>
         <TooltipPanel className="rounded-none text-xs">
            {pressed ? labelActive : labelInactive}
         </TooltipPanel>
      </Tooltip>
   );
}
