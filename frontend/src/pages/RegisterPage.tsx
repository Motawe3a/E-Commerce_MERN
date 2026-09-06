import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { register as registerRequest } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { normalizeError } from "@/lib/apiError";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Use at least 6 characters"),
});
type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, login } = useAuth();
  const next = params.get("next") || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(next, { replace: true });
  }, [isAuthenticated, navigate, next]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: RegisterForm) => registerRequest(values),
    onSuccess: (token) => {
      login(token);
      navigate(next, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });

  return (
    <div>
      <h2 className="text-5xl">Sign up</h2>
      <p className="mt-3 border-t-2 border-ink pt-3 font-sans text-sm text-muted">
        Takes a minute. Then the whole catalog opens up.
      </p>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="mt-8 space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message}>
            {(p) => <Input {...p} {...register("firstName")} autoComplete="given-name" />}
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            {(p) => <Input {...p} {...register("lastName")} autoComplete="family-name" />}
          </Field>
        </div>

        <Field label="Email" error={errors.email?.message}>
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

        <Field label="Password" error={errors.password?.message} hint="At least 6 characters.">
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
          Create account
        </Button>
      </form>

      <p className="mt-6 font-sans text-sm text-muted">
        Already a member?{" "}
        <Link
          to={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-ink underline decoration-spot decoration-2 underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
