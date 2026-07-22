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
import { SETTINGS_STRUCTURE } from "@/features/settings/components/settings-structure";

export function Settings({ userId }: { userId: string }) {
   const [searchQuery, setSearchQuery] = useState("");
   const { data: profile, isLoading, error } = useGetProfile(userId);
   const [scrollContainer, setScrollContainer] =
      useState<HTMLDivElement | null>(null);
   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
   const t = useTranslations("settings");

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
   }, [cleanSearchQuery]);

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
      <div className="flex h-full w-full flex-col gap-4">
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
                     <EmptyMedia>
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
                  className="h-full w-full bg-background"
                  offset={32}
                  rootMargin="-32px 0px -60% 0px"
               >
                  <ScrollSpyNav className="w-3xs gap-4 border-r pt-2">
                     {filteredGroups.map((group) => (
                        <div className="flex flex-col gap-2" key={group.value}>
                           <SettingsGroup
                              definitions={group}
                              className="px-4 pt-2"
                           >
                              {group.items.map((item) => (
                                 <SettingsRow
                                    key={item.value}
                                    definitions={item}
                                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                 />
                              ))}
                           </SettingsGroup>
                        </div>
                     ))}
                  </ScrollSpyNav>

                  <ScrollSpyViewport
                     ref={setScrollContainer}
                     className="overflow-y-auto p-4 pb-40"
                  >
                     {filteredGroups.map((group) => (
                        <div key={group.value}>
                           <h2>{t(group.titleKey)}</h2>
                           {group.items.map((item) => (
                              <ScrollSpySection
                                 key={item.value}
                                 value={item.value}
                              >
                                 <h2>{t(item.titleKey)}</h2>
                                 {item.descriptionKey && (
                                    <p>{t(item.descriptionKey)}</p>
                                 )}
                                 {item.children}
                              </ScrollSpySection>
                           ))}
                        </div>
                     ))}
                  </ScrollSpyViewport>
               </ScrollSpy>
            )}
         </div>
      </div>
   );
}
