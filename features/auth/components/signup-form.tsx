"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Field,
   FieldDescription,
   FieldError,
   FieldGroup,
   FieldLabel,
   FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpWithEmail } from "@/features/auth/auth.hook";
import { createSignUpSchema, SignUpInput } from "@/features/auth/auth.schema";
import { useTranslations } from "next-intl";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   GoogleIcon,
   ViewIcon,
   ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { useToggle } from "@/features/common/hooks/useToggle";
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleButton } from "@/features/common/components/toggle-button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@animateicons/react/lucide";
import {
   RippleButtonRipples,
   RippleButton,
} from "@/components/animate-ui/components/buttons/ripple";
import { Spinner } from "@/components/ui/spinner";

export function SignUpForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const t = useTranslations("auth.signup");
   const errorsTranslator = useTranslations("errors");
   const signUpSchema = createSignUpSchema(errorsTranslator);

   const form = useForm<SignUpInput>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   const { signUp, isSigningUp } = useSignUpWithEmail();

   const onSubmit = (data: SignUpInput) => {
      signUp(data, {
         onSuccess: () => {
            toast.success(t("toasts.success"));
            form.reset();
         },
         onError: (errors) => {
            errors.forEach((error) => {
               console.log(error);
               form.setError(
                  error.field as "email" | "password",
                  {
                     message: error.message,
                  },
                  {
                     shouldFocus: true,
                  }
               );
            });
         },
      });
   };

   const [showPassword, togglePassword] = useToggle(false);
   const [showConfirmPassword, toggleConfirmPassword] = useToggle(false);
   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
               <form
                  id="signup-form"
                  className="p-6 md:p-8"
                  onSubmit={form.handleSubmit(onSubmit)}
               >
                  <FieldGroup>
                     <div className="flex flex-col items-start gap-1 text-center">
                        <h1 className="text-2xl font-bold">{t("heading")}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                           {t("subheading")}
                        </p>
                     </div>

                     <Field className="grid">
                        <RippleButton
                           hoverScale={1}
                           variant="outline"
                           type="button"
                           rounded="none"
                           disabled={isSigningUp}
                        >
                           <HugeiconsIcon icon={GoogleIcon} />
                           {t("provider", {
                              provider: "Google",
                           })}
                           <span className="sr-only">
                              {t("provider", { provider: "Google" })}
                           </span>
                           <RippleButtonRipples />
                        </RippleButton>
                     </Field>

                     <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                        {t("separator")}
                     </FieldSeparator>

                     <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="signup-form-email">
                                 <div className="flex items-center">
                                    <span>{t("fields.email.label")}</span>
                                    <span className="text-destructive">*</span>
                                 </div>
                              </FieldLabel>

                              <Input
                                 {...field}
                                 id="signup-form-email"
                                 inputMode="email"
                                 placeholder={t("fields.email.placeholder")}
                                 aria-invalid={fieldState.invalid}
                                 className="text-xs"
                                 autoComplete="off"
                                 tabIndex={0}
                                 autoFocus
                              />

                              {fieldState.invalid && (
                                 <FieldError errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />
                     <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="signup-form-password">
                                 <div className="flex items-center">
                                    <span>{t("fields.password.label")}</span>
                                    <span className="text-destructive">*</span>
                                 </div>
                              </FieldLabel>
                              <InputGroup>
                                 <InputGroupInput
                                    {...field}
                                    id="signup-form-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t(
                                       "fields.password.placeholder"
                                    )}
                                    aria-invalid={fieldState.invalid}
                                    className="text-xs"
                                    tabIndex={0}
                                 />
                                 {field.value.length > 0 && (
                                    <InputGroupAddon
                                       align="inline-end"
                                       tabIndex={-1}
                                    >
                                       <ToggleButton
                                          size="icon-sm"
                                          pressed={showPassword}
                                          onStateChange={togglePassword}
                                          activeIcon={
                                             <EyeOffIcon duration={1} />
                                          }
                                          inactiveIcon={
                                             <EyeIcon duration={1} />
                                          }
                                          labelActive={t(
                                             "tooltips.hide_password"
                                          )}
                                          labelInactive={t(
                                             "tooltips.show_password"
                                          )}
                                       />
                                    </InputGroupAddon>
                                 )}
                              </InputGroup>

                              {fieldState.invalid && (
                                 <FieldError errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />

                     <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                           <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="signup-form-confirm-password">
                                 <div className="flex items-center">
                                    <span>
                                       {t("fields.confirm_password.label")}
                                    </span>
                                    <span className="text-destructive">*</span>
                                 </div>
                              </FieldLabel>
                              <InputGroup>
                                 <InputGroupInput
                                    className="text-xs"
                                    {...field}
                                    id="signup-form-confirm-password"
                                    type={
                                       showConfirmPassword ? "text" : "password"
                                    }
                                    placeholder={t(
                                       "fields.confirm_password.placeholder"
                                    )}
                                    aria-invalid={fieldState.invalid}
                                    tabIndex={0}
                                 />
                                 {field.value.length > 0 && (
                                    <InputGroupAddon
                                       align="inline-end"
                                       tabIndex={-1}
                                    >
                                       <ToggleButton
                                          size="icon-sm"
                                          pressed={showConfirmPassword}
                                          onStateChange={toggleConfirmPassword}
                                          activeIcon={
                                             <EyeOffIcon duration={1} />
                                          }
                                          inactiveIcon={
                                             <EyeIcon duration={1} />
                                          }
                                          labelActive={t(
                                             "tooltips.hide_password"
                                          )}
                                          labelInactive={t(
                                             "tooltips.show_password"
                                          )}
                                       />
                                    </InputGroupAddon>
                                 )}
                              </InputGroup>

                              {fieldState.invalid && (
                                 <FieldError errors={[fieldState.error]} />
                              )}
                           </Field>
                        )}
                     />

                     <Field>
                        <RippleButton
                           rounded="none"
                           hoverScale={1}
                           type="submit"
                           form="signup-form"
                           disabled={isSigningUp}
                        >
                           {isSigningUp ? (
                              <>
                                 <Spinner />
                                 {t("submitting")}
                              </>
                           ) : (
                              t("submit_button")
                           )}
                        </RippleButton>
                     </Field>

                     <FieldDescription className="text-center">
                        {t("footer_text")}{" "}
                        <Link href="/signin">{t("footer_link")}</Link>
                     </FieldDescription>
                  </FieldGroup>
               </form>
               <div className="relative hidden bg-muted md:block">
                  <Image
                     src="/placeholder.svg"
                     alt="Image"
                     width={500}
                     height={500}
                     className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
               </div>
            </CardContent>
         </Card>
         <FieldDescription className="px-6 text-center">
            {t("terms.agree")} <a href="#">{t("terms.tos")}</a> {t("terms.and")}{" "}
            <a href="#">{t("terms.privacy")}</a>.
         </FieldDescription>
      </div>
   );
}
