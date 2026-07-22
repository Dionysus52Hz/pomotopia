import {
   Tooltip,
   TooltipPanel,
   TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
} from "@/components/ui/input-group";
import {
   SearchIcon,
   SearchIconHandle,
   XIcon,
   XIconHandle,
} from "@animateicons/react/lucide";
import { BaseUIEvent } from "@base-ui/react";
import { useRef, MouseEvent } from "react";

interface SettingsSearchProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   resultLabel?: string;
   clearButtonTooltip?: string;
}

export function SettingsSearch({
   value,
   onChange,
   placeholder = "Search settings...",
   resultLabel,
   clearButtonTooltip = "Clear",
}: SettingsSearchProps) {
   const searchIconRef = useRef<SearchIconHandle>(null);
   const clearIconRef = useRef<XIconHandle>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const handleClearInput = (
      event: BaseUIEvent<MouseEvent<HTMLButtonElement>>
   ) => {
      event.preventDefault();
      onChange("");
      inputRef.current?.focus();
   };

   return (
      <div className="p-4 pb-0">
         <InputGroup className="overflow-hidden rounded-full">
            <InputGroupAddon>
               <SearchIcon ref={searchIconRef} size={16} />
            </InputGroupAddon>
            <InputGroupInput
               ref={inputRef}
               type="text"
               autoComplete="off"
               placeholder={placeholder}
               value={value}
               onFocus={() => searchIconRef.current?.startAnimation()}
               onBlur={() => searchIconRef.current?.stopAnimation()}
               onChange={(e) => onChange(e.target.value)}
               className="text-xs"
            />
            {value && resultLabel && (
               <InputGroupAddon align="inline-end">
                  <Badge variant="secondary">{resultLabel}</Badge>
               </InputGroupAddon>
            )}
            {value && (
               <InputGroupAddon align="inline-end">
                  <Tooltip>
                     <TooltipTrigger
                        render={
                           <Button
                              variant="ghost"
                              size="icon-xs"
                              onMouseEnter={() =>
                                 clearIconRef.current?.startAnimation()
                              }
                              onMouseLeave={() =>
                                 clearIconRef.current?.stopAnimation()
                              }
                              onClick={handleClearInput}
                           >
                              <XIcon ref={clearIconRef} size={16} />
                           </Button>
                        }
                     ></TooltipTrigger>
                     <TooltipPanel className="rounded-full">
                        {clearButtonTooltip}
                     </TooltipPanel>
                  </Tooltip>
               </InputGroupAddon>
            )}
         </InputGroup>
      </div>
   );
}
