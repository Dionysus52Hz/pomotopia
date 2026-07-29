"use client";

import { cn } from "@/lib/utils";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
   FieldTitle,
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
   RippleButton,
   RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
   createUserInformationSchema,
   UserInformationInput,
} from "@/features/profile/profile.schema";
import { useUpdateUserInformation } from "@/features/profile/profile.hook";
import { FullProfileDTO } from "@/features/profile/profile.dto";

export function InformationForm({
   initialInformation,
   className,
   ...props
}: React.ComponentProps<"div"> & {
   initialInformation: Pick<FullProfileDTO, "username">;
}) {
   const t = useTranslations("profile");
   const errorsTranslator = useTranslations("errors");
   const informationSchema = createUserInformationSchema(errorsTranslator);

   const form = useForm<UserInformationInput>({
      resolver: zodResolver(informationSchema),
      defaultValues: {
         username: initialInformation.username ?? "",
      },

      reValidateMode: "onSubmit",
   });

   const { updateUserInformation, isUpdatingUserInformation } =
      useUpdateUserInformation();

   const onSubmit = (data: UserInformationInput) => {
      updateUserInformation(data, {
         onSuccess: () => {
            toast.success(t("toasts.success.information"));
         },
         onError: (errors) => {
            errors.forEach((error) => {
               form.setError(
                  error.field as "username",
                  {
                     message: errorsTranslator(error.code),
                  },
                  {
                     shouldFocus: true,
                  }
               );
            });
         },
      });
   };

   return (
      <div
         data-slot="user-information-form"
         className={cn(
            "col-span-full flex flex-col xs:col-span-2 xs:gap-4 md:gap-6",
            className
         )}
         {...props}
      >
         <form id="information-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
               <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                     <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="information-form-email">
                           <div className="flex items-center">
                              <FieldTitle>
                                 {t("fields.display_name.label")}
                              </FieldTitle>
                              <span className="text-destructive">*</span>
                           </div>
                        </FieldLabel>

                        <Input
                           {...field}
                           id="information-form-display-name"
                           placeholder={t("fields.display_name.placeholder")}
                           aria-invalid={fieldState.invalid}
                           autoComplete="off"
                           className="bg-input/30 text-xs selection:bg-primary selection:text-primary-foreground"
                           onFocus={(event) => {
                              event.target.select();
                           }}
                        />

                        {fieldState.invalid && (
                           <FieldError errors={[fieldState.error]} />
                        )}
                     </Field>
                  )}
               />

               <Field>
                  <RippleButton
                     rounded="none"
                     type="submit"
                     form="information-form"
                     hoverScale={1}
                     disabled={isUpdatingUserInformation}
                  >
                     {isUpdatingUserInformation ? (
                        <>
                           <Spinner /> {t("submitting")}
                        </>
                     ) : (
                        t("submit_button")
                     )}
                     <RippleButtonRipples />
                  </RippleButton>
               </Field>
            </FieldGroup>
         </form>
      </div>
   );
}
