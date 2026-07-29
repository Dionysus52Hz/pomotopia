"use client";

import {
   Dialog,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogPopup,
   DialogTitle,
} from "@/components/animate-ui/components/base/dialog";
import {
   RippleButton,
   RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import { Field, FieldError } from "@/components/ui/field";
import {
   createUserAvatarSchema,
   UserAvatarInput,
} from "@/features/profile/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { customCode, handleZodValidationError } from "@/lib/api/validation";
import { AppError } from "@/lib/api/error";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";
import { toast } from "sonner";
import { COMMON_ERRORS } from "@/constants/common-errors";
import { Input } from "@/components/ui/input";
import { VARIABLES } from "@/constants/variables";
import {
   ImageIcon,
   UploadIcon,
   UploadIconHandle,
} from "@animateicons/react/lucide";
import {
   Empty,
   EmptyDescription,
   EmptyHeader,
   EmptyMedia,
   EmptyTitle,
} from "@/components/ui/empty";
import { AvatarHistory } from "@/lib/drizzle/schema/profiles";
import { UserAvatarDTO } from "@/features/profile/profile.dto";

interface AvatarGalleryProps {
   isOpen: boolean;
   onClose: () => void;
   avatarHistory: UserAvatarDTO["avatarHistory"];
   onSelectFile: (file: File) => void;
}

export function AvatarGallery({
   isOpen,
   onClose,
   avatarHistory,
   onSelectFile,
}: AvatarGalleryProps) {
   const t = useTranslations("profile");
   const errorsTranslator = useTranslations("errors");

   const fileInputRef = useRef<HTMLInputElement>(null);
   const uploadImageIconRef = useRef<UploadIconHandle>(null);
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const avatarSchema = createUserAvatarSchema(errorsTranslator);

   const handleClickUploadImageButton = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      const validation = avatarSchema.safeParse({ file });

      if (validation.success) {
         onSelectFile(file);
      } else {
         const [data, errors] = handleZodValidationError(validation.error, {
            defaultError: AppError.convertToAppError(
               PROFILE_ERRORS.validation.INVALID_USERNAME
            ),
         });
         if (errors && errors.length > 0) {
            toast.error(errors[0].message);
         } else toast.error(COMMON_ERRORS.system.INTERNAL_SERVER_ERROR.message);
      }
   };

   const handleSelectHistoryAvatar = (avatarUrl: string) => {
      console.log("select history avatar");
   };
   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => !open && onClose()}
         disablePointerDismissal={true}
      >
         <DialogPopup className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>{t("avatar_gallery.title")}</DialogTitle>
            </DialogHeader>

            <Input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               accept={VARIABLES.FILES.USER_AVATAR.ACCEPTED_FILE_TYPES.join(
                  ","
               )}
               className="hidden"
            />

            <div className="flex flex-col gap-6">
               <RippleButton
                  type="button"
                  hoverScale={1}
                  onClick={handleClickUploadImageButton}
                  onMouseEnter={() =>
                     uploadImageIconRef.current?.startAnimation()
                  }
                  onMouseLeave={() =>
                     uploadImageIconRef.current?.stopAnimation()
                  }
               >
                  <UploadIcon ref={uploadImageIconRef} />{" "}
                  {t("avatar_gallery.upload_image_button")}
                  <RippleButtonRipples />
               </RippleButton>

               <div className="flex flex-col gap-2">
                  <h4 className="md:text-md text-center text-sm font-semibold sm:text-left">
                     {t("avatar_gallery.uploaded_images")}
                  </h4>

                  {avatarHistory.length === 0 ? (
                     <Empty>
                        <EmptyHeader>
                           <EmptyMedia variant="icon">
                              <ImageIcon size={24} />
                           </EmptyMedia>
                           <EmptyTitle>
                              {t("avatar_gallery.no_history.title")}
                           </EmptyTitle>
                        </EmptyHeader>
                     </Empty>
                  ) : (
                     <div className="grid grid-cols-3 gap-3">
                        {avatarHistory.map((item) => (
                           <div
                              key={item.publicId}
                              onClick={() =>
                                 handleSelectHistoryAvatar(item.secureUrl)
                              }
                              className="group relative aspect-square w-full overflow-hidden rounded-md border bg-muted transition-all hover:ring-2 hover:ring-primary"
                           >
                              <Image
                                 src={item.secureUrl}
                                 alt="Avatar history"
                                 fill
                                 className="object-cover transition-transform group-hover:scale-105"
                              />
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </DialogPopup>
      </Dialog>
   );
}
