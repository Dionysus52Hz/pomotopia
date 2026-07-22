import { useState, useCallback } from "react";

export function useToggle(initialState: boolean = false) {
   const [value, setValue] = useState(initialState);

   const toggle = useCallback(() => setValue((prev) => !prev), []);
   const setTrue = useCallback(() => setValue(true), []);
   const setFalse = useCallback(() => setValue(false), []);

   return [value, toggle, { setTrue, setFalse, setValue }] as const;
}
