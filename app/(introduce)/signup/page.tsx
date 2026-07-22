import { SignUpForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
   return (
      <div className="flex min-h-[calc(100dvh-60px)] flex-col items-center justify-center bg-muted p-6 md:p-10">
         <div className="w-full max-w-sm md:max-w-4xl">
            <SignUpForm />
         </div>
      </div>
   );
}
