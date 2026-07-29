"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import {
   Button as ButtonPrimitive,
   type ButtonProps as ButtonPrimitiveProps,
} from "@/components/animate-ui/primitives/buttons/button";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
   "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-[box-shadow,_color,_background-color,_border-color,_outline-color,_text-decoration-color,_fill,_stroke] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
   {
      variants: {
         variant: {
            default:
               "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            accent:
               "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90",
            destructive:
               "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
            outline:
               "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
            secondary:
               "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline",
         },
         size: {
            default:
               "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-3.5",
            xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-2.5",
            sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
            lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-4",
            icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
            "icon-xs":
               "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
            "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
            "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
         },
         rounded: {
            default: "rounded-md",
            small: "rounded-sm",
            full: "rounded-full",
            none: "rounded-none",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
         rounded: "default",
      },
   }
);

type ButtonProps = ButtonPrimitiveProps & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, rounded, ...props }: ButtonProps) {
   return (
      <ButtonPrimitive
         className={cn(buttonVariants({ variant, size, rounded, className }))}
         {...props}
      />
   );
}

export { Button, buttonVariants, type ButtonProps };
