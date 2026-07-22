import { StatusCodes } from "http-status-codes";

export const COMMON_ERRORS = {
   system: {
      REQUEST_TIMEOUT: {
         code: "common.system.REQUEST_TIMEOUT",
         message:
            "The server took too long to respond. Please try again later.",
         statusCode: StatusCodes.REQUEST_TIMEOUT,
      },
      INTERNAL_SERVER_ERROR: {
         code: "common.system.INTERNAL_SERVER_ERROR",
         message: "Something went wrong.",
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
      DATABASE_ERROR: {
         code: "common.system.DATABASE_ERROR",
         message: "Database connection failed.",
         statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      },
      DATA_NOT_FOUND: {
         code: "common.system.DATA_NOT_FOUND",
         message: "The request data could not be found.",
         statusCode: StatusCodes.NOT_FOUND,
      },
   },
};
