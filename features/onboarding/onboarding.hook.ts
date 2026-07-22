import { useAppMutation } from "@/hooks/use-app-mutation";
import { completeOnboardingAction } from "./onboarding.action";
import { OnboardingInput } from "@/features/onboarding/onboarding.schema";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useOnboarding() {
   const queryClient = useQueryClient();
   const router = useRouter();
   const supabase = getSupabaseBrowserClient();

   const {
      mutate: submitOnboarding,
      isPending: isSubmittingOnboarding,
      error: submitOnboardingError,
   } = useAppMutation({
      mutationFn: async (payload: OnboardingInput) => {
         const [data, error] = await completeOnboardingAction(payload);
         if (error) throw error;
         return data;
      },
      onSuccess: async (data) => {
         await supabase.auth.refreshSession();

         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER_PROFILE, data.publicId],
         });

         router.push("/");
      },
   });

   return {
      submitOnboarding,
      isSubmittingOnboarding,
      submitOnboardingError,
   };
}
