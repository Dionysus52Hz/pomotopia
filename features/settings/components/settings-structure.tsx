import { Blend } from "@/components/animate-ui/icons/blend";
import { Paintbrush } from "@/components/animate-ui/icons/paintbrush";
import { Sparkles } from "@/components/animate-ui/icons/sparkles";
import { SettingsGroupDef } from "@/features/settings/components/settings.types";
import {
   KeySquareIcon,
   ShieldCheckIcon,
   UserIcon,
} from "@animateicons/react/lucide";

export const SETTINGS_STRUCTURE: SettingsGroupDef[] = [
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
            children: <div className="h-60 bg-accent" />,
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
            descriptionKey: "account.profile.description",
            icon: UserIcon,
            iconSource: "animateicons",
            iconProps: {
               size: 16,
               strokeWidth: 1.5,
            },
            children: <div className="h-60 bg-accent" />,
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
            children: <div className="h-60 bg-accent" />,
         },
      ],
   },
];
