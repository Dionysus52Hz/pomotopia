import { AvatarHistory } from "@/lib/drizzle/schema/profiles";

export interface UserAvatarDTO {
   publicId: string;
   username: string | null;
   avatarUrl: string | null;
   avatarHistory: AvatarHistory[];
}

export interface FullProfileDTO extends UserAvatarDTO {
   level: number;
}

export type StatsServiceDTO = {
   publicId: string;
   level: number;
   exp: number;
   timeEssence: number;
};

export type StatsActionDTO = {
   publicId: string;
   level: number;
   exp: number;
   timeEssence: number;
};
