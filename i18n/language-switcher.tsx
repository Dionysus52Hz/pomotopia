"use client";

import { useLocale, useTranslations } from "next-intl";
import { changeLanguageAction } from "@/i18n/action";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { CheckIcon, type CheckIconHandle } from "@animateicons/react/huge";
import { VARIABLES } from "@/constants/variables";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   RippleButton,
   RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import {
   Popover,
   PopoverTrigger,
   PopoverPanel,
} from "@/components/animate-ui/components/base/popover";
import {
   Tooltip,
   TooltipPanel,
   TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { GlobeIcon, GlobeIconHandle } from "@animateicons/react/lucide";

export function LanguageSwitcher() {
   const currentLocale = useLocale();
   const router = useRouter();
   const t = useTranslations("common.i18n");
   const checkIconRef = useRef<CheckIconHandle>(null);
   const globeIconRef = useRef<GlobeIconHandle>(null);

   const [isPending, startTransition] = useTransition();

   const handleChangeLanguage = async (newLocale: string) => {
      if (newLocale === currentLocale) return;

      await changeLanguageAction(newLocale);

      startTransition(() => {
         router.refresh();
      });
   };

   const languageOptions = VARIABLES.I18N.SUPPORTED_LOCALES.map((language) => {
      return (
         <RippleButton
            hoverScale={1}
            variant="ghost"
            rounded="none"
            disabled={isPending}
            key={language}
            onClick={() => handleChangeLanguage(language)}
            className="justify-between px-2!"
            onMouseEnter={() => {
               if (currentLocale === language) {
                  checkIconRef.current?.startAnimation();
               }
               return;
            }}
            onMouseLeave={() => {
               if (currentLocale === language) {
                  checkIconRef.current?.stopAnimation();
               }
               return;
            }}
         >
            {t(`${language}.label`)}
            {currentLocale === language && <CheckIcon ref={checkIconRef} />}
            <RippleButtonRipples />
         </RippleButton>
      );
   });

   return (
      <Popover>
         <PopoverTrigger
            nativeButton={false}
            render={
               <div>
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <RippleButton
                              rounded="none"
                              variant="outline"
                              className="flex items-center gap-2 px-2! shadow-none"
                              onMouseEnter={() =>
                                 globeIconRef.current?.startAnimation()
                              }
                              onMouseLeave={() => {
                                 globeIconRef.current?.stopAnimation();
                              }}
                           >
                              <GlobeIcon ref={globeIconRef} />
                              <span className="text-xs">
                                 {t(`${currentLocale}.abbreviation`)}
                              </span>
                              <RippleButtonRipples />
                           </RippleButton>
                        }
                     ></TooltipTrigger>
                     <TooltipPanel className="rounded-none" sideOffset={12}>
                        <span className="text-xs">
                           {t("tooltips.language_switcher")}
                        </span>
                     </TooltipPanel>
                  </Tooltip>
               </div>
            }
         ></PopoverTrigger>
         <PopoverPanel align="end" className="w-max min-w-30 rounded-none p-0">
            <ScrollArea className="h-fit p-1">
               <div className="flex flex-col gap-1">{languageOptions}</div>
            </ScrollArea>
         </PopoverPanel>
      </Popover>
   );
}
