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
import { Container } from "@/components/layout/Container";
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
      toast.success("Welcome back");
      navigate(next, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });

  return (
    <Container className="flex flex-col items-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-ink">Log in</h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back. Enter your details to continue.
        </p>

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6"
        >
          <Field label="Email" error={errors.email?.message}>
            {(props) => (
              <Input
                {...props}
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            )}
          </Field>

          <Field label="Password" error={errors.password?.message}>
            {(props) => (
              <Input
                {...props}
                {...register("password")}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            )}
          </Field>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={mutation.isPending}
          >
            Log in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            to={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-brand-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  );
}
