import { ComponentType, CSSProperties, ReactNode, Ref } from "react";

type IconSource = "animate-ui" | "animateicons";

export interface IconHandle {
   startAnimation: () => void;
   stopAnimation: () => void;
}

export interface IconProps {
   size?: number;
   strokeWidth?: number;
   color?: string;
   className?: string;
   duration?: number;
   style?: CSSProperties;
}

export interface SettingsRowDef {
   value: string;
   titleKey: string;
   descriptionKey?: string;
   iconSource: IconSource;
   icon: ComponentType<{ ref?: Ref<IconHandle>; className?: string }>;
   iconProps?: IconProps;
   render?: () => ReactNode;
}

export interface SettingsGroupDef {
   value: string;
   titleKey: string;
   descriptionKey: string;
   icon: ComponentType<{ ref?: Ref<IconHandle>; className?: string }>;
   iconSource: IconSource;
   iconProps?: IconProps;
   items: SettingsRowDef[];
}
