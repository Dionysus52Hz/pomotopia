"use server";

import { AUTH_ERRORS } from "@/features/auth/auth.error";
import {
   createSignInSchema,
   createSignUpSchema,
} from "@/features/auth/auth.schema";
import {
   signUpWithEmail,
   signInWithEmail,
   signOut,
} from "@/features/auth/auth.service";
import { AppResponse, MakeError, MakeSuccess } from "@/lib/api/response";
import { UserActionDTO } from "@/features/auth/auth.dto";
import { getTranslations } from "next-intl/server";
import { AppError } from "@/lib/api/error";
import { handleZodValidationError } from "@/lib/api/validation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function signUpWithEmailAction(
   payload: unknown
): Promise<AppResponse<UserActionDTO>> {
   const t = await getTranslations("errors");
   const signUpSchema = createSignUpSchema(t);
   const validation = signUpSchema.safeParse(payload);

   if (!validation.success) {
      return handleZodValidationError(validation.error, {
         defaultError: AppError.convertToAppError(
            AUTH_ERRORS.validation.INVALID_INPUT
         ),
         fieldErrors: {
            email: AppError.convertToAppError(
               AUTH_ERRORS.validation.EMAIL_REQUIRED
            ),
            password: AppError.convertToAppError(
               AUTH_ERRORS.validation.PASSWORD_REQUIRED
            ),
         },
      });
   }

   const supabase = await getSupabaseServerClient();
   const { email, password } = validation.data;
   const [user, error] = await signUpWithEmail(supabase, { email, password });

   if (error) {
      return MakeError(error);
   }

   const userDTO: UserActionDTO = {
      publicId: user.publicId,
   };

   return MakeSuccess(userDTO);
}

export async function signInWithEmailAction(
   payload: unknown
): Promise<AppResponse<UserActionDTO>> {
   const supabase = await getSupabaseServerClient();
   const t = await getTranslations("errors");
   const signInSchema = createSignInSchema(t);
   const validation = signInSchema.safeParse(payload);

   if (!validation.success) {
      return handleZodValidationError(validation.error, {
         defaultError: AppError.convertToAppError(
            AUTH_ERRORS.validation.INVALID_INPUT
         ),
         fieldErrors: {
            email: AppError.convertToAppError({
               ...AUTH_ERRORS.validation.EMAIL_REQUIRED,
               field: "email",
            }),
            password: AppError.convertToAppError({
               ...AUTH_ERRORS.validation.PASSWORD_REQUIRED,
               field: "password",
            }),
         },
      });
   }

   const { email, password } = validation.data;
   const [user, error] = await signInWithEmail(supabase, {
      email: email,
      password: password,
   });

   if (error) {
      return MakeError(error);
   }

   const userDTO: UserActionDTO = {
      publicId: user.publicId,
   };

   return MakeSuccess(userDTO);
}

export async function signOutAction(): Promise<AppResponse<null>> {
   const supabase = await getSupabaseServerClient();
   const [, error] = await signOut(supabase);

   if (error) {
      return MakeError(error);
   }

   return MakeSuccess(null);
}
