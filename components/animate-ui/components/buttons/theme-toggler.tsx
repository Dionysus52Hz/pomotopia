"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { VariantProps } from "class-variance-authority";

import {
   ThemeToggler as ThemeTogglerPrimitive,
   type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
   type ThemeSelection,
   type Resolved,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { buttonVariants } from "@/components/animate-ui/components/buttons/icon";
import { cn } from "@/lib/utils";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Airplay } from "@/components/animate-ui/icons/airplay";
import { Sun } from "@/components/animate-ui/icons/sun";
import { Moon } from "@/components/animate-ui/icons/moon";
import {
   Tooltip,
   TooltipPanel,
   TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { _Translator, TranslationValues, useTranslations } from "next-intl";
import { translateAxis } from "motion/react";

const emptySubscribe = () => () => {};
function useIsClient() {
   return React.useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false
   );
}

const getIcon = (
   effective: ThemeSelection,
   resolved: Resolved,
   modes: ThemeSelection[]
) => {
   const theme = modes.includes("system") ? effective : resolved;
   return theme === "system" ? (
      <Airplay animation="default-loop" />
   ) : theme === "dark" ? (
      <Moon animation="balancing" />
   ) : (
      <Sun />
   );
};

const getNextTheme = (
   effective: ThemeSelection,
   modes: ThemeSelection[]
): ThemeSelection => {
   const i = modes.indexOf(effective);
   if (i === -1) return modes[0];
   return modes[(i + 1) % modes.length];
};

const getTooltipText = (
   effective: ThemeSelection,
   modes: ThemeSelection[],
   translator: _Translator
) => {
   const nextTheme = getNextTheme(effective, modes);

   return translator(`switch_to_${nextTheme}`);
};

type ThemeTogglerButtonProps = React.ComponentProps<"button"> &
   VariantProps<typeof buttonVariants> & {
      modes?: ThemeSelection[];
      onImmediateChange?: ThemeTogglerPrimitiveProps["onImmediateChange"];
      direction?: ThemeTogglerPrimitiveProps["direction"];
   };

function ThemeTogglerButton({
   variant = "default",
   size = "default",
   modes = ["light", "dark", "system"],
   direction = "ltr",
   onImmediateChange,
   onClick,
   className,
   ...props
}: ThemeTogglerButtonProps) {
   const { theme, resolvedTheme, setTheme } = useTheme();
   const isClient = useIsClient();
   const t = useTranslations(
      "settings.appearance.theme.tooltips.theme_toggler"
   );

   return (
      <ThemeTogglerPrimitive
         theme={theme as ThemeSelection}
         resolvedTheme={resolvedTheme as Resolved}
         setTheme={setTheme}
         direction={direction}
         onImmediateChange={onImmediateChange}
      >
         {({ effective, resolved, toggleTheme }) => (
            <Tooltip>
               <TooltipTrigger
                  render={
                     <AnimateIcon animateOnHover>
                        <button
                           data-slot="theme-toggler-button"
                           className={cn(
                              buttonVariants({ variant, size, className })
                           )}
                           onClick={(e) => {
                              onClick?.(e);
                              toggleTheme(getNextTheme(effective, modes));
                           }}
                           {...props}
                        >
                           {isClient ? (
                              getIcon(effective, resolved, modes)
                           ) : (
                              <span className="size-4" />
                           )}
                        </button>
                     </AnimateIcon>
                  }
               ></TooltipTrigger>
               <TooltipPanel className="rounded-full" sideOffset={12}>
                  {getTooltipText(effective, modes, t)}
               </TooltipPanel>
            </Tooltip>
         )}
      </ThemeTogglerPrimitive>
   );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
