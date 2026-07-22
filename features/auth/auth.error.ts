import { COMMON_ERRORS } from "@/constants/common-errors";
import { SerializedAppError } from "@/lib/api/error";
import { StatusCodes } from "http-status-codes";

export const AUTH_ERRORS = {
   validation: {
      EMAIL_REQUIRED: {
         code: "auth.validation.EMAIL_REQUIRED",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Missing email",
      },
      PASSWORD_REQUIRED: {
         code: "auth.validation.PASSWORD_REQUIRED",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Missing password",
      },
      INVALID_INPUT: {
         code: "auth.validation.INVALID_INPUT",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Invalid input. Cannot validate.",
      },
      PASSWORD_TOO_SHORT: {
         code: "auth.validation.PASSWORD_TOO_SHORT",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Password too short",
      },
      INVALID_EMAIL: {
         code: "auth.validation.INVALID_EMAIL",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Invalid email format",
      },
   },
   business: {
      USER_ALREADY_EXISTS: {
         code: "auth.business.USER_ALREADY_EXISTS",
         message:
            "The provided information is already registered to another account.",
         statusCode: StatusCodes.CONFLICT,
      },
      INVALID_CREDENTIALS: {
         code: "auth.business.INVALID_CREDENTIALS",
         message: "Authentication failed. Incorrect account email or password.",
         statusCode: StatusCodes.UNAUTHORIZED,
      },
      UNAUTHORIZED: {
         code: "auth.business.UNAUTHORIZED",
         message: "The login session has expired.",
         statusCode: StatusCodes.UNAUTHORIZED,
      },
      FORBIDDEN: {
         code: "auth.business.FORBIDDEN",
         message: "You don't have permission to access this resource.",
         statusCode: StatusCodes.FORBIDDEN,
      },
      USER_NOT_FOUND: {
         code: "auth.business.USER_NOT_FOUND",
         message: "User to which the API request relates no longer exists.",
         statusCode: StatusCodes.NOT_FOUND,
      },
   },
   system: {
      PROVIDER_DOWN: {
         code: "auth.system.PROVIDER_DOWN",
         message: "Something went wrong with auth system.",
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
   },
} as const;

export const SUPABASE_ERRORS: Record<string, SerializedAppError> = {
   user_already_exists: AUTH_ERRORS.business.USER_ALREADY_EXISTS,
   invalid_credentials: AUTH_ERRORS.business.INVALID_CREDENTIALS,
   user_not_found: AUTH_ERRORS.business.USER_NOT_FOUND,
   request_timeout: COMMON_ERRORS.system.REQUEST_TIMEOUT,
} satisfies Record<string, SerializedAppError>;
