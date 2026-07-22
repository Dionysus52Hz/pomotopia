export type ProfileServiceDTO = {
   publicId: string;
   username: string | null;
   avatarUrl: string | null;
};

export type ProfileActionDTO = {
   publicId: string;
   username: string | null;
   avatarUrl: string | null;
};

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
