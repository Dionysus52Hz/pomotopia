"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ScrollSpyLink } from "@/components/ui/scroll-spy";
import {
   IconHandle,
   SettingsGroupDef,
   SettingsRowDef,
} from "@/features/settings/components/settings.types";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function IIcon({
   definitions,
   isHovered,
}: {
   definitions: SettingsRowDef;
   isHovered: boolean;
}) {
   const iconRef = useRef<IconHandle>(null);
   const Icon = definitions.icon;

   useEffect(() => {
      if (definitions.iconSource !== "animateicons" || !iconRef.current) return;

      if (isHovered) {
         iconRef.current.startAnimation?.();
      } else {
         iconRef.current.stopAnimation?.();
      }
   }, [isHovered, definitions.iconSource]);

   if (!Icon) return null;

   const extraProps = definitions.iconProps || {};

   if (definitions.iconSource === "animateicons") {
      return <Icon ref={iconRef} {...extraProps} />;
   }

   if (definitions.iconSource === "animate-ui") {
      return (
         <AnimateIcon animate={isHovered} animateOnView>
            <Icon ref={iconRef} {...extraProps} />
         </AnimateIcon>
      );
   }

   return <Icon {...extraProps} />;
}

export function SettingsGroup({
   definitions,
   className,
   children,
}: {
   definitions: SettingsGroupDef;
   className?: string;
   children: ReactNode;
}) {
   const t = useTranslations("settings");
   return (
      <div
         key={definitions.value}
         className={cn("flex flex-col gap-2", className)}
      >
         <div className="flex items-center gap-2">
            <IIcon definitions={definitions} isHovered={true} />
            <span className="text-xs font-medium">
               {t(definitions.titleKey)}
            </span>
         </div>
         <div className="ml-1.5 flex flex-col gap-1 pl-2">{children}</div>
      </div>
   );
}

export function SettingsRow({
   definitions,
   className,
}: {
   definitions: SettingsRowDef;
   className?: string;
}) {
   const [isHovered, setIsHovered] = useState<boolean>(false);
   const t = useTranslations("settings");

   return (
      <ScrollSpyLink
         className={cn("flex items-center gap-2 py-1.5", className)}
         value={definitions.value}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <IIcon definitions={definitions} isHovered={isHovered} />
         <span className="text-xs">{t(definitions.titleKey)}</span>
      </ScrollSpyLink>
   );
}
