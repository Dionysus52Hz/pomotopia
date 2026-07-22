import IntroduceNavbar from "@/components/layouts/introduce-navbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function IntroduceLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="flex h-dvh w-screen flex-col overflow-hidden">
         <IntroduceNavbar />

         <main className="min-h-0 w-full flex-1">
            <ScrollArea className="h-full w-full">
               <div className="pt-15">{children}</div>
               <ScrollBar />
            </ScrollArea>
         </main>
      </div>
   );
}
