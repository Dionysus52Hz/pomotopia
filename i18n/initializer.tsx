"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initI18nCookiesAction } from "@/i18n/action";
import { VARIABLES } from "@/constants/variables";

export function I18nInitializer() {
   const router = useRouter();

   useEffect(() => {
      const hasTimeZoneCookie = document.cookie.includes(
         VARIABLES.I18N.TIME_ZONE_KEY
      );
      const hasLocaleCookie = document.cookie.includes(
         VARIABLES.I18N.LOCALE_KEY
      );
      if (!hasTimeZoneCookie || !hasLocaleCookie) {
         const browserTimeZone =
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            VARIABLES.I18N.DEFAULT_TIME_ZONE;
         initI18nCookiesAction({
            locale: VARIABLES.I18N.DEFAULT_LOCALE,
            timeZone: browserTimeZone,
         }).then(() => {
            router.refresh();
         });
      }
   }, [router]);

   return null;
}
