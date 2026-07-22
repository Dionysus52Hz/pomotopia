"use client";

import {
   Cursor,
   CursorProvider,
} from "@/components/animate-ui/primitives/animate/cursor";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
   environmentManager,
   QueryClient,
   QueryClientProvider,
} from "@tanstack/react-query";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import NextTopLoader from "nextjs-toploader";

function makeQueryClient() {
   return new QueryClient({
      defaultOptions: {
         queries: {
            staleTime: 60 * 1000,
         },
      },
   });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
   if (environmentManager.isServer()) {
      return makeQueryClient();
   } else {
      if (!browserQueryClient) browserQueryClient = makeQueryClient();
      return browserQueryClient;
   }
}

export function Providers({
   children,
   messages,
   locale,
   timeZone,
}: {
   children: React.ReactNode;
   messages: AbstractIntlMessages;
   locale: string;
   timeZone: string;
}) {
   const queryClient = getQueryClient();

   return (
      <NextIntlClientProvider
         messages={messages}
         locale={locale}
         timeZone={timeZone}
      >
         <QueryClientProvider client={queryClient}>
            <CursorProvider global={true}>
               <TooltipProvider>
                  <ThemeProvider>
                     <NextTopLoader
                        initialPosition={0.08}
                        height={2}
                        color="currentColor"
                        showSpinner={false}
                     />
                     {/* <Cursor>
                        <svg
                           className="size-6 text-foreground"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 40 40"
                        >
                           <path
                              fill="currentColor"
                              d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
                           />
                        </svg>
                     </Cursor> */}
                     {children}
                  </ThemeProvider>
               </TooltipProvider>
            </CursorProvider>
         </QueryClientProvider>
      </NextIntlClientProvider>
   );
}
