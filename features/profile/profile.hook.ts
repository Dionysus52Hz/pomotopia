import {
   getProfileAction,
   getStatsAction,
   updateUserAvatarAction,
   updateUserInformationAction,
} from "@/features/profile/profile.action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAppMutation } from "@/hooks/use-app-mutation";
import {
   UserAvatarInput,
   UserInformationInput,
} from "@/features/profile/profile.schema";
import { FullProfileDTO } from "@/features/profile/profile.dto";

export function useGetProfile(
   publicId: string,
   initialProfile?: FullProfileDTO | null
) {
   return useQuery({
      queryKey: [QUERY_KEYS.USER_PROFILE, publicId],
      queryFn: async () => {
         if (!publicId) return null;

         const [data, error] = await getProfileAction({ publicId: publicId });
         if (error) throw error;
         return data;
      },

      enabled: !!publicId,
      staleTime: 1000 * 60 * 5,
      initialData: initialProfile,
   });
}

export function useGetStats(publicId: string) {
   return useQuery({
      queryKey: [QUERY_KEYS.USER_STATS, publicId],
      queryFn: async () => {
         if (!publicId) return null;

         const [data, error] = await getStatsAction({ publicId: publicId });
         if (error) throw error;
         return data;
      },

      enabled: !!publicId,
      staleTime: 1000 * 60 * 5,
   });
}

export function useUpdateUserInformation() {
   const queryClient = useQueryClient();
   const supabase = getSupabaseBrowserClient();

   const {
      mutate: updateUserInformation,
      isPending: isUpdatingUserInformation,
      error: updateUserInformationError,
   } = useAppMutation({
      mutationOptions: {
         mutationFn: async (payload: UserInformationInput) => {
            const [data, error] = await updateUserInformationAction(payload);
            if (error) throw error;
            return data;
         },
         onSuccess: async (data) => {
            await supabase.auth.refreshSession();

            queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.USER_PROFILE, data.publicId],
            });
         },
      },
   });

   return {
      updateUserInformation,
      isUpdatingUserInformation,
      updateUserInformationError,
   };
}

export function useUpdateUserAvatar() {
   const queryClient = useQueryClient();

   const {
      mutate: updateUserAvatar,
      isPending: isUpdatingUserAvatar,
      error: updateUserAvatarError,
   } = useAppMutation({
      mutationOptions: {
         mutationFn: async (payload: UserAvatarInput) => {
            const [data, error] = await updateUserAvatarAction(payload);
            if (error) throw error;
            return data;
         },
         onSuccess: async (data) => {
            queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.USER_PROFILE, data.publicId],
            });
         },
      },
   });

   return {
      updateUserAvatar,
      isUpdatingUserAvatar,
      updateUserAvatarError,
   };
}
