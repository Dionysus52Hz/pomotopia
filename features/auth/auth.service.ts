import { SignInInput, SignUpInput } from "@/features/auth/auth.schema";
import { AUTH_ERRORS } from "@/features/auth/auth.error";
import { ServiceResponse } from "@/lib/api/response";
import { UserServiceDTO } from "@/features/auth/auth.dto";
import { handleAuthError } from "@/features/auth/auth.helper";
import { AppError } from "@/lib/api/error";
import { SupabaseClient } from "@supabase/supabase-js";

export async function signUpWithEmail(
   supabase: SupabaseClient,
   payload: Omit<SignUpInput, "confirmPassword">
): Promise<ServiceResponse<UserServiceDTO>> {
   const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
         data: {
            onboarding_completed: false,
         },
      },
   });

   if (error) {
      return [null, [handleAuthError(error)]];
   }

   if (!data || !data.user) {
      return [
         null,
         [AppError.convertToAppError(AUTH_ERRORS.business.USER_NOT_FOUND)],
      ];
   }

   const userDTO: UserServiceDTO = {
      publicId: data.user.id,
      email: data.user.email,
   };
   return [userDTO, null];
}

export async function signInWithEmail(
   supabase: SupabaseClient,
   payload: SignInInput
): Promise<ServiceResponse<UserServiceDTO>> {
   const { data, error } = await supabase.auth.signInWithPassword(payload);

   if (error) {
      return [null, [handleAuthError(error)]];
   }

   if (!data || !data.user) {
      return [
         null,
         [AppError.convertToAppError(AUTH_ERRORS.business.USER_NOT_FOUND)],
      ];
   }

   const userDTO: UserServiceDTO = {
      publicId: data.user.id,
      email: data.user.email,
   };
   return [userDTO, null];
}

export async function signOut(
   supabase: SupabaseClient
): Promise<ServiceResponse<null>> {
   const { error } = await supabase.auth.signOut();

   if (error) {
      return [null, [handleAuthError(error)]];
   }

   return [null, null];
}
