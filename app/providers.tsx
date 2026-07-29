"use client";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogPopup,
   AlertDialogTitle,
} from "@/components/animate-ui/components/base/alert-dialog";
import {
   RippleButton,
   RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import {
   Cursor,
   CursorProvider,
} from "@/components/animate-ui/primitives/animate/cursor";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
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

export function AlertDialogProvider() {
   const { current, isOpen, handleConfirm, handleCancel, handleEscape } =
      useAlertDialog();

   if (!current && !isOpen) return null;

   return (
      <AlertDialog
         open={isOpen}
         onOpenChange={(open) => !open && handleEscape()}
      >
         <AlertDialogPopup className="p-4">
            <AlertDialogHeader>
               <AlertDialogTitle className="flex items-center justify-center gap-2 sm:justify-start">
                  {current?.icon}
                  {current?.title}
               </AlertDialogTitle>
               {current?.description && (
                  <AlertDialogDescription>
                     {current.description}
                  </AlertDialogDescription>
               )}
            </AlertDialogHeader>
            <AlertDialogFooter>
               <RippleButton
                  hoverScale={1}
                  onClick={handleCancel}
                  variant={
                     current?.cancelButtonVariant === "default"
                        ? "accent"
                        : current?.cancelButtonVariant === "ghost"
                          ? "ghost"
                          : "outline"
                  }
               >
                  {current?.cancelLabel}
                  <RippleButtonRipples />
               </RippleButton>

               <RippleButton
                  hoverScale={1}
                  onClick={handleConfirm}
                  variant={
                     current?.confirmButtonVariant === "destructive"
                        ? "destructive"
                        : "default"
                  }
               >
                  {current?.confirmLabel}
                  <RippleButtonRipples />
               </RippleButton>
            </AlertDialogFooter>
         </AlertDialogPopup>
      </AlertDialog>
   );
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
                     <Toaster
                        position="top-center"
                        invert
                        swipeDirections={["left", "top"]}
                     />
                     <AlertDialogProvider />
                     {children}
                  </ThemeProvider>
               </TooltipProvider>
            </CursorProvider>
         </QueryClientProvider>
      </NextIntlClientProvider>
   );
}
