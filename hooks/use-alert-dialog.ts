import { useState, useEffect, type ReactNode } from "react";

export interface AlertOptions {
   title?: string;
   description?: string;
   confirmLabel?: string;
   cancelLabel?: string;
   confirmButtonVariant?: "default" | "destructive";
   cancelButtonVariant?: "default" | "ghost" | "outline";
   icon?: ReactNode;
   closeAfter?: number;
}

interface DialogItem extends AlertOptions {
   resolve: (value: boolean) => void;
}

const queue: DialogItem[] = [];
let current: DialogItem | null = null;
let isOpenState = false;
const listeners = new Set<() => void>();

const emitChange = () => {
   listeners.forEach((listener) => listener());
};

const next = () => {
   current = queue.shift() ?? null;
   isOpenState = !!current;
   emitChange();
};

export const alertDialog = {
   confirm: (options: AlertOptions = {}): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
         queue.push({
            resolve,
            title: options.title ?? "Are you absolutely sure?",
            description: options.description,
            confirmLabel: options.confirmLabel ?? "Continue",
            cancelLabel: options.cancelLabel ?? "Cancel",
            confirmButtonVariant: options.confirmButtonVariant ?? "destructive",
            cancelButtonVariant: options.cancelButtonVariant ?? "default",
            icon: options.icon,
            closeAfter: options.closeAfter ?? 200,
         });

         if (!current) {
            next();
         }
      });
   },

   closeAndResolve: (
      result: boolean,
      options: Pick<AlertOptions, "closeAfter"> = {}
   ) => {
      if (!current) return;

      const itemToResolve = current;
      isOpenState = false;
      emitChange();

      setTimeout(() => {
         itemToResolve.resolve(result);
         next();
      }, options.closeAfter ?? 200);
   },

   handleConfirm: () => {
      alertDialog.closeAndResolve(true);
   },

   handleCancel: () => {
      alertDialog.closeAndResolve(false);
   },

   handleEscape: () => {
      alertDialog.handleCancel();
   },
};

export function useAlertDialog() {
   const [state, setState] = useState({
      current,
      isOpen: isOpenState,
   });

   useEffect(() => {
      const handleChange = () => {
         setState({ current, isOpen: isOpenState });
      };
      listeners.add(handleChange);
      return () => {
         listeners.delete(handleChange);
      };
   }, []);

   return {
      current: state.current,
      isOpen: state.isOpen,
      confirm: alertDialog.confirm,
      handleConfirm: alertDialog.handleConfirm,
      handleCancel: alertDialog.handleCancel,
      handleEscape: alertDialog.handleEscape,
   };
}
