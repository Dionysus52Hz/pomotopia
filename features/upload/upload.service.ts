import { COMMON_ERRORS } from "@/constants/common-errors";
import { AppError } from "@/lib/api/error";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary/client";

type ResourceType = "video" | "image";

export async function uploadToCloudinary(
   uploadPreset: string,
   buffer: Buffer,
   resourceType: ResourceType = "image"
): Promise<UploadApiResponse> {
   return new Promise((resolve, reject) => {
      cloudinary.uploader
         .unsigned_upload_stream(
            uploadPreset,
            {
               resource_type: resourceType,
            },
            (error, result) => {
               if (error) return reject(error);
               if (!result)
                  return reject(
                     AppError.convertToAppError(
                        COMMON_ERRORS.system.INTERNAL_SERVER_ERROR
                     )
                  );
               return resolve(result);
            }
         )
         .end(buffer);
   });
}

export async function deleteFromCloudinary(
   publicResourceId: string,
   resourceType: ResourceType = "image"
) {
   const result = await cloudinary.uploader.destroy(publicResourceId, {
      resource_type: resourceType,
   });

   return result;
}
