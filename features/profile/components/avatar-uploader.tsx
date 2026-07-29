"use client";

import {
   Menu,
   MenuGroup,
   MenuItem,
   MenuPanel,
   MenuTrigger,
} from "@/components/animate-ui/components/base/menu";
import BorderGlow from "@/components/react-bits/BorderGlow";
import { FieldTitle } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarEditor } from "@/features/profile/components/avatar-editor";
import { AvatarGallery } from "@/features/profile/components/avatar-gallery";
import { UserAvatarDTO } from "@/features/profile/profile.dto";
import { useUpdateUserAvatar } from "@/features/profile/profile.hook";
import { UserAvatarInput } from "@/features/profile/profile.schema";
import { cn } from "@/lib/utils";
import {
   EyeIcon,
   EyeIconHandle,
   ImageIcon,
   ImageIconHandle,
} from "@animateicons/react/lucide";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AvatarUploaderProps {
   initialAvatar: UserAvatarDTO;
}

export function AvatarUploader({ initialAvatar }: AvatarUploaderProps) {
   const t = useTranslations("profile");
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isEditorOpen, setIsEditorOpen] = useState(false);
   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
   const [isPreviewAvatarLoading, setIsPreviewAvatarLoading] = useState(true);
   const viewAvatarIconRef = useRef<EyeIconHandle>(null);
   const selectAvatarIconRef = useRef<ImageIconHandle>(null);
   const { updateUserAvatar, isUpdatingUserAvatar } = useUpdateUserAvatar();

   const handleSelectFile = (file: File) => {
      setSelectedFile(file);
      setIsGalleryOpen(false);
      setIsEditorOpen(true);
   };

   const handleCloseEditor = () => {
      setIsEditorOpen(false);
      setSelectedFile(null);
      setIsGalleryOpen(true);
   };

   const handleConfirmUpload = async (data: UserAvatarInput) => {
      updateUserAvatar(data, {
         onSuccess: () => {
            toast.success(t("toasts.success.avatar"));
            setIsEditorOpen(false);
            setIsGalleryOpen(false);
            setSelectedFile(null);
         },
      });
   };

   return (
      <div
         data-slot="avatar-uploader"
         className="relative col-span-full flex h-full w-full flex-col gap-2 xs:col-span-1"
      >
         <FieldTitle>{t("fields.avatar.label")}</FieldTitle>
         <Menu>
            <MenuTrigger
               nativeButton={false}
               render={
                  <div className="aspect-square w-full">
                     <BorderGlow
                        edgeSensitivity={1}
                        glowRadius={60}
                        borderRadius={0}
                        backgroundColor="var(--primary-foreground)"
                        className="relative aspect-square w-full cursor-pointer border! border-border! p-1 shadow-none!"
                     >
                        {isPreviewAvatarLoading && (
                           <Skeleton className="absolute inset-0 h-full w-full" />
                        )}
                        <Image
                           src={
                              initialAvatar.avatarUrl ??
                              "/images/default-user-avatar.png"
                           }
                           fill
                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 300px, 400px"
                           className={cn(
                              "object-cover transition-opacity duration-300",
                              isPreviewAvatarLoading
                                 ? "opacity-0"
                                 : "opacity-100"
                           )}
                           alt={initialAvatar.publicId}
                           onLoad={() => setIsPreviewAvatarLoading(false)}
                        ></Image>
                     </BorderGlow>
                  </div>
               }
            ></MenuTrigger>

            <MenuPanel side="top" className="rounded-none">
               <MenuGroup>
                  <MenuItem
                     className="cursor-pointer"
                     onMouseEnter={() =>
                        viewAvatarIconRef.current?.startAnimation()
                     }
                     onMouseLeave={() =>
                        viewAvatarIconRef.current?.stopAnimation
                     }
                  >
                     <EyeIcon ref={viewAvatarIconRef} />
                     <span className="text-xs font-medium">
                        {t("fields.avatar.options.view_avatar")}
                     </span>
                  </MenuItem>
                  <MenuItem
                     className="cursor-pointer rounded-none"
                     onClick={() => {
                        setIsGalleryOpen(true);
                     }}
                     onMouseEnter={() =>
                        selectAvatarIconRef.current?.startAnimation()
                     }
                     onMouseLeave={() =>
                        selectAvatarIconRef.current?.stopAnimation
                     }
                  >
                     <ImageIcon ref={selectAvatarIconRef} />
                     <span className="text-xs font-medium">
                        {t("fields.avatar.options.select_avatar")}
                     </span>
                  </MenuItem>
               </MenuGroup>
            </MenuPanel>
         </Menu>

         <AvatarGallery
            isOpen={isGalleryOpen}
            onClose={() => {
               setIsGalleryOpen(false);
            }}
            onSelectFile={handleSelectFile}
            avatarHistory={initialAvatar.avatarHistory}
         />

         <AvatarEditor
            selectedFile={selectedFile}
            isOpen={isEditorOpen}
            onClose={handleCloseEditor}
            onUploadAvatar={handleConfirmUpload}
            isUploadingAvatar={isUpdatingUserAvatar}
         />
      </div>
   );
}
