import {
   getProfileAction,
   getStatsAction,
} from "@/features/profile/profile.action";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useGetProfile(publicId: string) {
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
