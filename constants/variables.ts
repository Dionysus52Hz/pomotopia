export const VARIABLES = {
   I18N: {
      SUPPORTED_LOCALES: ["vi", "en"],
      LOCALE_KEY: "NEXT_I18N_LOCALE",
      DEFAULT_LOCALE: "vi",
      TIME_ZONE_KEY: "NEXT_I18N_TIME_ZONE",
      DEFAULT_TIME_ZONE: "UTC",
   },
   FILES: {
      USER_AVATAR: {
         MAX_FILE_SIZE_MB: 5,
         MAX_FILE_SIZE_B: 1024 * 1024 * 5,
         ACCEPTED_FILE_TYPES: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
         ],
         PHASH_SIMILARITY_THRESHOLD: 0.8,
      },
   },
} as const;
