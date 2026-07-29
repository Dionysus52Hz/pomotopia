"use client";

import {
   ScrollSpy,
   ScrollSpyNav,
   ScrollSpySection,
   ScrollSpyViewport,
} from "@/components/ui/scroll-spy";

import { useGetProfile } from "@/features/profile/profile.hook";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
   Empty,
   EmptyDescription,
   EmptyHeader,
   EmptyMedia,
   EmptyTitle,
} from "@/components/ui/empty";
import { Formatter } from "@/lib/format";
import {
   SettingsGroup,
   SettingsRow,
} from "@/features/settings/components/settings-row";
import { SettingsSearch } from "@/features/settings/components/setting-search";
import debounce from "lodash.debounce";
import { Settings as SettingsIcon } from "@/components/animate-ui/icons/settings";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { createSettingsStructure } from "@/features/settings/components/settings-structure";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FullProfileDTO } from "@/features/profile/profile.dto";
import { Separator } from "@/components/ui/separator";

interface SettingsProps {
   userId: string;
   initialProfile: FullProfileDTO;
}

export function Settings({ userId, initialProfile }: SettingsProps) {
   const [searchQuery, setSearchQuery] = useState("");
   const { data: profile } = useGetProfile(userId, initialProfile);
   const [scrollContainer, setScrollContainer] =
      useState<HTMLDivElement | null>(null);
   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
   const t = useTranslations("settings");

   const currentProfile = initialProfile || profile;
   const SETTINGS_STRUCTURE = useMemo(
      () =>
         createSettingsStructure({
            initialProfile: currentProfile,
            initialUserAvatar: {
               avatarUrl: currentProfile.avatarUrl,
               publicId: currentProfile.publicId,
               username: currentProfile.username,
               avatarHistory: currentProfile.avatarHistory,
            },
         }),
      [currentProfile]
   );

   const handleDebounceSearch = useMemo(
      () =>
         debounce((value: string) => {
            setDebouncedSearchQuery(value);
         }, 300),
      []
   );

   const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      handleDebounceSearch(value);
   };

   const cleanSearchQuery = useMemo(
      () => Formatter.string.removeAccents(debouncedSearchQuery),
      [debouncedSearchQuery]
   );

   const matches = (titleKey: string, descriptionKey?: string) => {
      if (!cleanSearchQuery) return true;
      const title = Formatter.string.removeAccents(t(titleKey));
      const description = descriptionKey
         ? Formatter.string.removeAccents(t(descriptionKey))
         : "";
      return (
         title.includes(cleanSearchQuery) ||
         description.includes(cleanSearchQuery)
      );
   };

   const filteredGroups = useMemo(() => {
      return SETTINGS_STRUCTURE.map((group) => {
         const groupMatched = matches(group.titleKey);
         const items = group.items.filter(
            (item) =>
               groupMatched || matches(item.titleKey, item.descriptionKey)
         );
         return { ...group, items };
      }).filter((group) => group.items.length > 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [cleanSearchQuery, SETTINGS_STRUCTURE]);

   const key = useMemo(
      () =>
         filteredGroups
            .map((group) => group.items.map((item) => item.value).join(","))
            .join("-"),
      [filteredGroups]
   );

   const resultLabel = useMemo(() => {
      const totalSettingsFound = filteredGroups.reduce(
         (acc, group) => acc + group.items.length,
         0
      );
      return `${totalSettingsFound} ${t("search.result_label")}`;
   }, [filteredGroups, t]);

   const hasResults = filteredGroups.length > 0;

   useEffect(() => {
      return () => {
         handleDebounceSearch.cancel();
      };
   }, [handleDebounceSearch]);

   return (
      <div className="flex h-full w-full max-w-5xl flex-col">
         <SettingsSearch
            value={searchQuery}
            onChange={handleSearchChange}
            resultLabel={resultLabel}
            placeholder={t("search.placeholder")}
            clearButtonTooltip={t("search.tooltips.clear_button")}
         />

         <div className="flex min-h-0 flex-1 flex-col">
            {!hasResults ? (
               <Empty>
                  <EmptyHeader>
                     <EmptyMedia variant="icon">
                        <AnimateIcon animateOnView animation="rotate">
                           <SettingsIcon />
                        </AnimateIcon>
                     </EmptyMedia>
                     <EmptyTitle>{t("search.no_data.title")}</EmptyTitle>
                     <EmptyDescription>
                        {t("search.no_data.description", {
                           keyword: debouncedSearchQuery,
                        })}
                     </EmptyDescription>
                  </EmptyHeader>
               </Empty>
            ) : (
               <ScrollSpy
                  key={key}
                  scrollContainer={scrollContainer}
                  className="h-full w-full gap-2 p-4 pt-0"
                  offset={64}
                  rootMargin="-64px 0px -65% 0px"
               >
                  <ScrollSpyNav className="w-max gap-4 md:w-3xs">
                     <ScrollArea className="h-full w-full scroll-smooth border bg-muted/50 px-4">
                        {filteredGroups.map((group, index) => (
                           <div
                              className={cn(
                                 "flex flex-col gap-2",
                                 index === 0 && "pt-2"
                              )}
                              key={group.value}
                           >
                              <SettingsGroup
                                 definitions={group}
                                 className="pt-2"
                              >
                                 {group.items.map((item) => (
                                    <SettingsRow
                                       key={item.value}
                                       definitions={item}
                                       className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    />
                                 ))}
                              </SettingsGroup>
                           </div>
                        ))}
                     </ScrollArea>
                  </ScrollSpyNav>

                  <ScrollSpyViewport>
                     <ScrollArea
                        viewportRef={setScrollContainer}
                        className="h-full w-full scroll-smooth border bg-muted/50 px-4"
                     >
                        {filteredGroups.map((group, index) => (
                           <div
                              key={group.value}
                              className={cn(index === 0 && "pt-4")}
                           >
                              <h2 className="text-xl font-semibold md:text-2xl">
                                 {t(group.titleKey)}
                              </h2>
                              <div className="flex flex-col gap-4 py-4">
                                 {group.items.map((item) => (
                                    <ScrollSpySection
                                       key={item.value}
                                       value={item.value}
                                    >
                                       <h3 className="text-md font-semibold md:text-lg">
                                          {t(item.titleKey)}
                                       </h3>
                                       {item.descriptionKey && (
                                          <p className="text-xs font-medium text-muted-foreground">
                                             {t(item.descriptionKey)}
                                          </p>
                                       )}
                                       <div className="py-2">
                                          {item.render ? item.render() : null}
                                       </div>
                                    </ScrollSpySection>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </ScrollArea>
                  </ScrollSpyViewport>
               </ScrollSpy>
            )}
         </div>
      </div>
   );
}
