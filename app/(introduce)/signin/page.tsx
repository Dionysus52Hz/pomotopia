import { SignInForm } from "@/features/auth/components/signin-form";

export default function SignInPage() {
   return (
      <div className="flex min-h-[calc(100dvh-60px)] flex-col items-center justify-center bg-muted p-6 md:p-10">
         <div className="w-full max-w-sm md:max-w-4xl">
            <SignInForm />
         </div>
      </div>
   );
}
