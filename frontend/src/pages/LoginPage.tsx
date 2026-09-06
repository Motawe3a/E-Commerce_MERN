import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { login as loginRequest } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { normalizeError } from "@/lib/apiError";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
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
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: LoginForm) => loginRequest(values),
    onSuccess: (token) => {
      login(token);
      navigate(next, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });

  return (
    <div>
      <h2 className="text-5xl">Sign in</h2>
      <p className="mt-3 border-t-2 border-ink pt-3 font-sans text-sm text-muted">
        Members get first dibs on new arrivals and the back-room crates.
      </p>

      <form
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
        className="mt-8 space-y-5"
      >
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

        <Field label="Password" error={errors.password?.message}>
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
          Sign in
        </Button>
      </form>

      <p className="mt-6 font-sans text-sm text-muted">
        Not a member yet?{" "}
        <Link
          to={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-ink underline decoration-spot decoration-2 underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
