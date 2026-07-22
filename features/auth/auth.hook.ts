import {
   signUpWithEmailAction,
   signOutAction,
   signInWithEmailAction,
} from "@/features/auth/auth.action";
import { AppError } from "@/lib/api/error";
import { SignInInput, SignUpInput } from "@/features/auth/auth.schema";
import { useAppMutation } from "@/hooks/use-app-mutation";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useSignUpWithEmail() {
   const router = useRouter();
   const supabase = getSupabaseBrowserClient();

   const {
      mutate: signUp,
      isPending: isSigningUp,
      error: signUpError,
   } = useAppMutation({
      mutationFn: async (payload: SignUpInput) => {
         const [data, error] = await signUpWithEmailAction(payload);
         if (error) throw error;
         return data;
      },
      onSuccess: async () => {
         await supabase.auth.refreshSession();
         router.push("/onboarding");
      },
   });

   return {
      signUp,
      isSigningUp,
      signUpError,
   };
}

export function useSignInWithEmail() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const supabase = getSupabaseBrowserClient();

   const {
      mutate: signIn,
      isPending: isSigningIn,
      error: signInError,
   } = useAppMutation({
      mutationFn: async (payload: SignInInput) => {
         const [data, error] = await signInWithEmailAction(payload);
         if (error) throw error;
         return data;
      },
      onSuccess: async () => {
         await supabase.auth.refreshSession();
         queryClient.clear();
         router.push("/");
      },
   });

   return {
      signIn,
      isSigningIn,
      signInError,
   };
}

export function useSignOut() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const supabase = getSupabaseBrowserClient();

   const {
      mutate: signOut,
      isPending: isSigningOut,
      error: signOutError,
   } = useAppMutation({
      mutationFn: async () => {
         const [data, error] = await signOutAction();
         if (error) throw AppError.convertToAppError(error);
         return data;
      },
      onSuccess: async () => {
         await supabase.auth.signOut();
         queryClient.clear();
         router.push("/introduce");
      },
   });

   return {
      signOut,
      isSigningOut,
      signOutError,
   };
}
