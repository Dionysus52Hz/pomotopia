"use client";

import {
   Dialog,
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
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

interface AvatarEditorProps {
   selectedFile: File | null;
   isOpen: boolean;
   onClose: () => void;
   onUploadAvatar: (data: UserAvatarInput) => Promise<void>;
   isUploadingAvatar: boolean;
}

export function AvatarEditor({
   selectedFile,
   isOpen,
   onClose,
   onUploadAvatar,
   isUploadingAvatar,
}: AvatarEditorProps) {
   const t = useTranslations("profile");
   const errorsTranslator = useTranslations("errors");
   const avatarSchema = createUserAvatarSchema(errorsTranslator);

   const previewAvatar = useMemo(() => {
      if (!selectedFile) return null;
      return URL.createObjectURL(selectedFile);
   }, [selectedFile]);

   useEffect(() => {
      return () => {
         if (previewAvatar) {
            URL.revokeObjectURL(previewAvatar);
         }
      };
   }, [previewAvatar]);

   const form = useForm<UserAvatarInput>({
      resolver: zodResolver(avatarSchema),
      values: selectedFile ? { file: selectedFile } : undefined,
   });

   const onSubmit = async (data: UserAvatarInput) => {
      await onUploadAvatar(data);
      form.reset();
   };

   const { confirm } = useAlertDialog();
   const handleCloseEditor = async () => {
      const isConfirmed = await confirm({
         title: t("avatar_editor.confirm_exit.title"),
         description: t("avatar_editor.confirm_exit.description"),
         confirmButtonVariant: "destructive",
         cancelButtonVariant: "outline",
         confirmLabel: t("avatar_editor.confirm_exit.confirm_button"),
         cancelLabel: t("avatar_editor.confirm_exit.stay_button"),
         closeAfter: 300,
      });

      if (isConfirmed) {
         form.reset();
         onClose();
      }
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(open) => !open && handleCloseEditor()}
         disablePointerDismissal={true}
      >
         <DialogPopup
            className="flex h-full max-h-[calc(100%-2rem)] flex-col gap-4 p-0 sm:max-w-md"
            showCloseButton={false}
         >
            <DialogHeader className="p-4 pb-0">
               <DialogTitle>{t("avatar_editor.title")}</DialogTitle>
            </DialogHeader>

            <Separator />

            <ScrollArea className="min-h-0 w-full flex-1">
               <form
                  id="user-avatar-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 px-4"
               >
                  <Controller
                     name="file"
                     control={form.control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           {previewAvatar && (
                              <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-primary bg-muted/75 shadow-sm">
                                 <Image
                                    src={previewAvatar}
                                    alt="Avatar Preview"
                                    fill
                                    className="object-contain"
                                 />
                              </div>
                           )}
                           {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />
               </form>
            </ScrollArea>

            <DialogFooter className="flex shrink-0 gap-2 p-4 pt-0 sm:justify-end">
               <RippleButton
                  type="button"
                  rounded="full"
                  variant="outline"
                  onClick={handleCloseEditor}
                  disabled={isUploadingAvatar}
               >
                  {t("avatar_editor.cancel_button")}
                  <RippleButtonRipples />
               </RippleButton>

               <RippleButton
                  rounded="full"
                  type="submit"
                  form="user-avatar-form"
                  hoverScale={1}
                  disabled={isUploadingAvatar}
               >
                  {isUploadingAvatar ? (
                     <>
                        <Spinner /> {t("avatar_editor.submitting")}
                     </>
                  ) : (
                     t("avatar_editor.submit_button")
                  )}
                  <RippleButtonRipples />
               </RippleButton>
            </DialogFooter>
         </DialogPopup>
      </Dialog>
   );
}
