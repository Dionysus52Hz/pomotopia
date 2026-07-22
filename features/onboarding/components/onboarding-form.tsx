"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Field,
   FieldDescription,
   FieldError,
   FieldGroup,
} from "@/components/ui/field";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createOnboardingSchema } from "@/features/onboarding/onboarding.schema";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { OnboardingInput } from "@/features/onboarding/onboarding.schema";
import { useOnboarding } from "@/features/onboarding/onboarding.hook";
import { Input } from "@/components/ui/input";

export function OnboardingForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const t = useTranslations("onboarding");
   const onboardingSchemaTranslator = useTranslations(
      "errors.onboarding.validation"
   );
   const translator = useTranslations("errors");
   const onboardingSchema = createOnboardingSchema(onboardingSchemaTranslator);

   const form = useForm<OnboardingInput>({
      resolver: zodResolver(onboardingSchema),
      defaultValues: {
         username: "",
      },
   });

   const { submitOnboarding, isSubmittingOnboarding } = useOnboarding();

   const onSubmit = (data: OnboardingInput) => {
      submitOnboarding(data, {
         onSuccess: () => {
            toast.success(t("toasts.success"));
         },
         onError: (errors) => {
            errors.forEach((error) => {
               form.setError(
                  "username",
                  {
                     message: translator(error.code),
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
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
               <form
                  id="onboarding-form"
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit(onSubmit)}
               >
                  <FieldGroup>
                     <div className="flex flex-col items-start gap-1">
                        <h1 className="text-2xl font-bold">{t("heading")}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                           {t("subheading")}
                        </p>
                     </div>

                     <Controller
                        name="username"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid}>
                              <Input
                                 {...field}
                                 id="onboarding-form-username"
                                 placeholder={t("fields.username.placeholder")}
                                 aria-invalid={fieldState.invalid}
                              />

                              <FieldDescription>
                                 {t("fields.username.description")}
                              </FieldDescription>

                              {fieldState.invalid && (
                                 <FieldError errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />

                     <Field>
                        <Button
                           type="submit"
                           form="onboarding-form"
                           disabled={isSubmittingOnboarding}
                        >
                           {t("submit_button")}
                        </Button>
                     </Field>
                  </FieldGroup>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
