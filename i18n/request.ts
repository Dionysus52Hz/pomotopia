import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { VARIABLES } from "@/constants/variables";

type SupportedLocale = (typeof VARIABLES.I18N.SUPPORTED_LOCALES)[number];

export default getRequestConfig(async () => {
   const cookieStore = await cookies();
   const headerStore = await headers();

   const I18N_VARIABLES = VARIABLES.I18N;

   const localeFromCookie = cookieStore.get(I18N_VARIABLES.LOCALE_KEY)?.value;
   const rawLocale = localeFromCookie || I18N_VARIABLES.DEFAULT_LOCALE;

   const finalLocale: SupportedLocale =
      I18N_VARIABLES.SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)
         ? (rawLocale as SupportedLocale)
         : I18N_VARIABLES.DEFAULT_LOCALE;

   const messages = (await import(`./messages/${finalLocale}.json`)).default;

   const timezoneFromCookie = cookieStore.get(
      I18N_VARIABLES.TIME_ZONE_KEY
   )?.value;
   const timezoneFromHeader = headerStore.get("Sec-Ch-Node-Timezone");

   const finalTimeZone =
      timezoneFromCookie ||
      timezoneFromHeader ||
      I18N_VARIABLES.DEFAULT_TIME_ZONE;

   return {
      locale: finalLocale,
      messages,
      timeZone: finalTimeZone,
   };
});
