import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { login as loginRequest } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { useI18n } from "@/i18n/useI18n";
import { normalizeError } from "@/lib/apiError";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
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
        email: z.string().email(t("auth.emailInvalid")),
        password: z.string().min(1, t("auth.passwordRequired")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: LoginForm) => loginRequest(values),
    onSuccess: (token) => {
      login(token);
      navigate(next, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error, t)),
  });

  return (
    <div>
      <h2 className="text-5xl">{t("login.title")}</h2>
      <p className="mt-3 border-t-2 border-ink pt-3 font-sans text-sm text-muted">
        {t("login.blurb")}
      </p>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mt-8 space-y-5">
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

        <Field label={t("auth.passwordLabel")} error={errors.password?.message}>
          {(p) => (
            <Input
              {...p}
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          )}
        </Field>

        <Button type="submit" size="lg" className="w-full" isLoading={mutation.isPending}>
          {t("login.submit")}
        </Button>
      </form>

      <p className="mt-6 font-sans text-sm text-muted">
        {t("login.toRegisterQ")}{" "}
        <Link
          to={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-ink underline decoration-spot decoration-2 underline-offset-4"
        >
          {t("login.toRegister")}
        </Link>
      </p>
    </div>
  );
}
