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
import { Container } from "@/components/layout/Container";
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
      toast.success("Account created");
      navigate(next, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });

  return (
    <Container className="flex flex-col items-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-ink">Create an account</h1>
        <p className="mt-1 text-sm text-muted">
          It only takes a moment to get started.
        </p>

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              {(props) => (
                <Input
                  {...props}
                  {...register("firstName")}
                  autoComplete="given-name"
                />
              )}
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              {(props) => (
                <Input
                  {...props}
                  {...register("lastName")}
                  autoComplete="family-name"
                />
              )}
            </Field>
          </div>

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

          <Field
            label="Password"
            error={errors.password?.message}
            hint="At least 6 characters."
          >
            {(props) => (
              <Input
                {...props}
                {...register("password")}
                type="password"
                autoComplete="new-password"
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
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            to={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-brand-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
