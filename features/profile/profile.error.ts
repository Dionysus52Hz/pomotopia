import { StatusCodes } from "http-status-codes";

export const PROFILE_ERRORS = {
   validation: {
      USERNAME_TOO_SHORT: {
         code: "profile.validation.USERNAME_TOO_SHORT",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Password too long",
      },
      USERNAME_TOO_LONG: {
         code: "profile.validation.PASSWORD_TOO_LONG",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Password too long",
      },
      INVALID_USERNAME: {
         code: "profile.validation.INVALID_USERNAME",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Invalid username format",
      },
      INVALID_INPUT: {
         code: "profile.validation.INVALID_INPUT",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Invalid input format",
      },
      AVATAR_TOO_LARGE: {
         code: "profile.validation.AVATAR_TOO_LARGE",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Avatar file size is too large",
      },
      UNACCEPTED_AVATAR_FILE_TYPES: {
         code: "profile.validation.UNACCEPTED_AVATAR_FILE_TYPES",
         statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
         message: "Avatar file type is unaccepted",
      },
   },
   business: {
      USERNAME_ALREADY_EXISTS: {
         code: "profile.business.USERNAME_ALREADY_EXISTS",
         message: "This username is already taken.",
         statusCode: StatusCodes.CONFLICT,
      },
      USER_NOT_FOUND: {
         code: "profile.business.USER_NOT_FOUND",
         message: "User not found.",
         statusCode: StatusCodes.NOT_FOUND,
      },
   },
   system: {
      UPDATE_FAILED: {
         code: "profile.system.UPDATE_FAILED",
         message: "Something went wrong when updating the profile.",
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
   },
} as const;
