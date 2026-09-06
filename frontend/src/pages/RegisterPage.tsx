import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { register as registerRequest } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { useI18n } from "@/i18n/useI18n";
import { normalizeError } from "@/lib/apiError";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, login } = useAuth();
  const { t } = useI18n();
  const next = params.get("next") || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(next, { replace: true });
  }, [isAuthenticated, navigate, next]);

  const schema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, t("auth.required")),
        lastName: z.string().min(1, t("auth.required")),
        email: z.string().email(t("auth.emailInvalid")),
        password: z.string().min(6, t("auth.passwordShort")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: RegisterForm) => registerRequest(values),
    onSuccess: (token) => {
      login(token);
      toast.success(t("register.done"));
      navigate(next, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error, t)),
  });

  return (
    <div>
      <h2 className="text-5xl">{t("register.title")}</h2>
      <p className="mt-3 border-t-2 border-ink pt-3 font-sans text-sm text-muted">
        {t("register.blurb")}
      </p>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("register.firstName")} error={errors.firstName?.message}>
            {(p) => <Input {...p} {...register("firstName")} autoComplete="given-name" />}
          </Field>
          <Field label={t("register.lastName")} error={errors.lastName?.message}>
            {(p) => <Input {...p} {...register("lastName")} autoComplete="family-name" />}
          </Field>
        </div>

        <Field label={t("auth.emailLabel")} error={errors.email?.message}>
          {(p) => (
            <Input
              {...p}
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          )}
        </Field>

        <Field
          label={t("auth.passwordLabel")}
          error={errors.password?.message}
          hint={t("register.passwordHint")}
        >
          {(p) => (
            <Input
              {...p}
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          )}
        </Field>

        <Button type="submit" size="lg" className="w-full" isLoading={mutation.isPending}>
          {t("register.submit")}
        </Button>
      </form>

      <p className="mt-6 font-sans text-sm text-muted">
        {t("register.toLoginQ")}{" "}
        <Link
          to={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-ink underline decoration-spot decoration-2 underline-offset-4"
        >
          {t("register.toLogin")}
        </Link>
      </p>
    </div>
  );
}
