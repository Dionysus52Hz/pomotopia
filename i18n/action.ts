"use server";

import { cookies } from "next/headers";
import { VARIABLES } from "@/constants/variables";

export async function initI18nCookiesAction({
   locale,
   timeZone,
}: {
   locale: string;
   timeZone: string;
}) {
   const cookieStore = await cookies();

   cookieStore.set({
      name: VARIABLES.I18N.LOCALE_KEY,
      value: locale,
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
   });

   cookieStore.set({
      name: VARIABLES.I18N.TIME_ZONE_KEY,
      value: timeZone,
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
   });
}

export async function changeLanguageAction(newLocale: string) {
   const cookieStore = await cookies();

   cookieStore.set({
      name: VARIABLES.I18N.LOCALE_KEY,
      value: newLocale,
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
   });
}
