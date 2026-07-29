import { Geist_Mono, Inter, Inter_Tight } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { getMessages, getLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";
import { cookies } from "next/headers";
import { VARIABLES } from "@/constants/variables";
import { I18nInitializer } from "@/i18n/initializer";
import { Metadata } from "next";

const fontHeading = Inter_Tight({
   subsets: ["latin"],
   variable: "--font-heading",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
   subsets: ["latin"],
   variable: "--font-mono",
});

export const metadata: Metadata = {
   title: "Pomotopia",
   icons: {
      icon: "/icons/favicon.png",
   },
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const locale = await getLocale();
   const messages = await getMessages();
   const cookieStore = await cookies();
   const timeZone =
      cookieStore.get(VARIABLES.I18N.TIME_ZONE_KEY)?.value ||
      VARIABLES.I18N.DEFAULT_TIME_ZONE;

   return (
      <html
         lang={locale}
         suppressHydrationWarning
         className={cn(
            "antialiased",
            fontHeading.variable,
            fontMono.variable,
            "font-sans",
            inter.variable
         )}
      >
         <body>
            <I18nInitializer />

            <Providers messages={messages} locale={locale} timeZone={timeZone}>
               {children}
            </Providers>
         </body>
      </html>
   );
}
