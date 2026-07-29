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
import { useSignInWithEmail } from "@/features/auth/auth.hook";
import { createSignInSchema, SignInInput } from "@/features/auth/auth.schema";
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
import {
   RippleButton,
   RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "@animateicons/react/lucide";

export function SignInForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const t = useTranslations("auth.signin");
   const errorsTranslator = useTranslations("errors");
   const signInSchema = createSignInSchema(errorsTranslator);

   const form = useForm<SignInInput>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const { signIn, isSigningIn } = useSignInWithEmail();

   const onSubmit = (data: SignInInput) => {
      signIn(data, {
         onSuccess: () => {
            toast.success(t("toasts.success"));
            form.reset();
         },
         onError: (errors) => {
            errors.forEach((error) => {
               form.setError(
                  error.field as "email" | "password",
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

   const [showPassword, togglePassword] = useToggle(false);

   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
               <form
                  id="signin-form"
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
                           rounded="none"
                           variant="outline"
                           type="button"
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
                              <FieldLabel htmlFor="signin-form-email">
                                 <div className="flex items-center">
                                    <span>{t("fields.email.label")}</span>
                                    <span className="text-destructive">*</span>
                                 </div>
                              </FieldLabel>

                              <Input
                                 {...field}
                                 id="signin-form-email"
                                 inputMode="email"
                                 placeholder={t("fields.email.placeholder")}
                                 aria-invalid={fieldState.invalid}
                                 autoComplete="off"
                                 className="text-xs"
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
                              <FieldLabel htmlFor="signin-form-password">
                                 <div className="flex items-center">
                                    <span>{t("fields.password.label")}</span>
                                    <span className="text-destructive">*</span>
                                 </div>
                              </FieldLabel>
                              <InputGroup className="overflow-hidden">
                                 <InputGroupInput
                                    {...field}
                                    id="signin-form-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t(
                                       "fields.password.placeholder"
                                    )}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="off"
                                    className="text-xs"
                                 />
                                 {field.value.length > 0 && (
                                    <InputGroupAddon align="inline-end">
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

                     <Field>
                        <RippleButton
                           hoverScale={1}
                           rounded="none"
                           type="submit"
                           form="signin-form"
                           disabled={isSigningIn}
                        >
                           {isSigningIn ? (
                              <>
                                 <Spinner /> {t("submitting")}
                              </>
                           ) : (
                              t("submit_button")
                           )}
                           <RippleButtonRipples />
                        </RippleButton>
                     </Field>

                     <FieldDescription className="text-center">
                        {t("footer_text")}{" "}
                        <Link href="/signup">{t("footer_link")}</Link>
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
      </div>
   );
}
