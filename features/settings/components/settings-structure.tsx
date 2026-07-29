import { Blend } from "@/components/animate-ui/icons/blend";
import { Sparkles } from "@/components/animate-ui/icons/sparkles";
import { AvatarUploader } from "@/features/profile/components/avatar-uploader";
import { InformationForm } from "@/features/profile/components/profile-form";
import { FullProfileDTO, UserAvatarDTO } from "@/features/profile/profile.dto";
import { SettingsGroupDef } from "@/features/settings/components/settings.types";
import {
   KeySquareIcon,
   ShieldCheckIcon,
   UserIcon,
} from "@animateicons/react/lucide";

interface SettingsStructureProps {
   initialProfile: FullProfileDTO;
   initialUserAvatar: UserAvatarDTO;
}

export const createSettingsStructure = ({
   initialProfile,
   initialUserAvatar,
}: SettingsStructureProps): SettingsGroupDef[] => {
   return [
      {
         value: "appearance",
         titleKey: "appearance.title",
         descriptionKey: "appearance.description",
         icon: Blend,
         iconSource: "animate-ui",
         iconProps: {
            size: 16,
            strokeWidth: 1.5,
         },
         items: [
            {
               value: "theme",
               titleKey: "appearance.theme.title",
               descriptionKey: "appearance.theme.description",
               icon: Sparkles,
               iconSource: "animate-ui",
               iconProps: {
                  size: 16,
                  strokeWidth: 1.5,
               },
               render: () => <div className="h-60 bg-accent" />,
            },
         ],
      },
      {
         value: "account",
         titleKey: "account.title",
         descriptionKey: "account.description",
         icon: KeySquareIcon,
         iconSource: "animateicons",
         iconProps: {
            size: 16,
            strokeWidth: 1.5,
         },
         items: [
            {
               value: "profile",
               titleKey: "account.profile.title",
               icon: UserIcon,
               iconSource: "animateicons",
               iconProps: {
                  size: 16,
                  strokeWidth: 1.5,
               },
               render: () => (
                  <div className="grid-col-1 grid gap-y-6 xs:grid-cols-3 xs:gap-x-4 md:gap-x-6">
                     <AvatarUploader
                        key={initialUserAvatar.avatarUrl}
                        initialAvatar={initialUserAvatar}
                     />
                     <InformationForm initialInformation={initialProfile} />
                  </div>
               ),
            },
            {
               value: "security",
               titleKey: "account.security.title",
               descriptionKey: "account.security.description",
               icon: ShieldCheckIcon,
               iconSource: "animateicons",
               iconProps: {
                  size: 16,
                  strokeWidth: 1.5,
               },
               render: () => <div className="h-60 bg-accent" />,
            },
         ],
      },
   ];
};
