import { StatusCodes } from "http-status-codes";

export const ONBOARDING_ERRORS = {
   validation: {
      USERNAME_TOO_SHORT: {
         code: "onboarding.validation.USERNAME_TOO_SHORT",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Password too long",
      },
      USERNAME_TOO_LONG: {
         code: "onboarding.validation.PASSWORD_TOO_LONG",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Password too long",
      },
      INVALID_USERNAME: {
         code: "onboarding.validation.INVALID_USERNAME",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Invalid username format",
      },
   },
   business: {
      USERNAME_ALREADY_EXISTS: {
         code: "onboarding.business.USERNAME_ALREADY_EXISTS",
         message: "This username is already taken.",
         statusCode: StatusCodes.CONFLICT,
      },
      ONBOARDING_ALREADY_COMPLETED: {
         code: "onboarding.business.ONBOARDING_ALREADY_COMPLETED",
         message: "You have already completed the onboarding step.",
         statusCode: StatusCodes.CONFLICT,
      },
      USER_NOT_FOUND: {
         code: "onboarding.business.USER_NOT_FOUND",
         message: "User not found.",
         statusCode: StatusCodes.NOT_FOUND,
      },
   },
   system: {
      UPDATE_FAILED: {
         code: "onboarding.system.UPDATE_FAILED",
         message: "Something went wrong when updating the onboarding.",
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
   },
} as const;
