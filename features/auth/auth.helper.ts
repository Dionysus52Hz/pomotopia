import { COMMON_ERRORS } from "@/constants/common-errors";
import { AUTH_ERRORS, SUPABASE_ERRORS } from "@/features/auth/auth.error";
import { AppError } from "@/lib/api/error";
import { ServiceResponse } from "@/lib/api/response";
import { isAuthApiError, SupabaseClient, User } from "@supabase/supabase-js";

export function handleAuthError(error: unknown): AppError {
   if (isAuthApiError(error)) {
      if (error.code && SUPABASE_ERRORS[error.code]) {
         const config = SUPABASE_ERRORS[error.code];

         return new AppError(
            config.code,
            error.message || config.message,
            config.statusCode
         );
      }
      const config = AUTH_ERRORS.system.PROVIDER_DOWN;
      return new AppError(
         config.code,
         error.message || config.message,
         config.statusCode
      );
   }

   return AppError.convertToAppError(
      COMMON_ERRORS.system.INTERNAL_SERVER_ERROR
   );
}

export async function authenticate(
   supabase: SupabaseClient
): Promise<ServiceResponse<User>> {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error || !user) {
      return [
         null,
         [AppError.convertToAppError(AUTH_ERRORS.business.UNAUTHORIZED)],
      ];
   }

   return [user, null];
}

interface AuthorizeOptions {
   ownerId?: string;
   shouldBeOwner?: boolean;
   requiredRoles?: ("admin" | "moderator" | "user")[];
   requiredPermissions?: string[];
   customCheck?: (user: User) => boolean | Promise<boolean>;
}

export async function authorize(
   user: User,
   options: AuthorizeOptions = {}
): Promise<ServiceResponse<true>> {
   if (options.shouldBeOwner) {
      if (!options.ownerId || user.id !== options.ownerId) {
         return [
            null,
            [AppError.convertToAppError(AUTH_ERRORS.business.FORBIDDEN)],
         ];
      }
   }

   if (options.requiredRoles && options.requiredRoles.length > 0) {
      const userRole =
         user.app_metadata?.role || user.user_metadata?.role || "user";

      const hasRequiredRole = options.requiredRoles.includes(userRole);
      if (!hasRequiredRole) {
         return [
            null,
            [AppError.convertToAppError(AUTH_ERRORS.business.FORBIDDEN)],
         ];
      }
   }

   if (options.requiredPermissions && options.requiredPermissions.length > 0) {
      const userPermissions: string[] = user.app_metadata?.permissions || [];

      const hasAllPermissions = options.requiredPermissions.every(
         (permission) => userPermissions.includes(permission)
      );
      if (!hasAllPermissions) {
         return [
            null,
            [AppError.convertToAppError(AUTH_ERRORS.business.FORBIDDEN)],
         ];
      }
   }

   if (options.customCheck) {
      const isPassed = await options.customCheck(user);
      if (!isPassed) {
         return [
            null,
            [AppError.convertToAppError(AUTH_ERRORS.business.FORBIDDEN)],
         ];
      }
   }

   return [true, null];
}
