import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Disc3 } from "lucide-react";
import { checkout } from "@/api/orders";
import { useCart } from "@/hooks/useCart";
import { normalizeError } from "@/lib/apiError";
import { queryKeys } from "@/lib/queryClient";
import { Container } from "@/components/layout/Container";
import { Button, buttonClass } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { CartSummary } from "@/components/cart/CartSummary";

const schema = z.object({
  fullName: z.string().min(2, "Enter the recipient's name"),
  street: z.string().min(3, "Enter a street address"),
  city: z.string().min(2, "Enter a city"),
  postalCode: z.string().min(3, "Enter a postal code"),
  country: z.string().min(2, "Enter a country"),
});
type CheckoutForm = z.infer<typeof schema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cart, isLoading, itemCount } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(schema) });

  const placeOrder = useMutation({
    mutationFn: (address: string) => checkout(address),
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.cart, null);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      toast.success("Order placed");
      navigate(`/orders/${order._id}`, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });

  if (isLoading) {
    return (
      <Container className="py-14">
        <PageLoader label="Checking your crate" />
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-14">
        <EmptyState
          icon={Disc3}
          title="Nothing to check out"
          description="Your crate is empty."
          action={
            <Link to="/" className={buttonClass()}>
              Browse the catalog
            </Link>
          }
        />
      </Container>
    );
  }

  const onSubmit = (v: CheckoutForm) =>
    placeOrder.mutate(
      `${v.fullName}, ${v.street}, ${v.city} ${v.postalCode}, ${v.country}`,
    );

  return (
    <Container className="py-10 md:py-14">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to crate
      </Link>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 border-2 border-ink bg-card p-6"
        >
          <h2 className="text-2xl">Ship to</h2>

          <Field label="Full name" error={errors.fullName?.message}>
            {(p) => (
              <Input {...p} {...register("fullName")} autoComplete="name" placeholder="Ada Lovelace" />
            )}
          </Field>
          <Field label="Street address" error={errors.street?.message}>
            {(p) => (
              <Input
                {...p}
                {...register("street")}
                autoComplete="street-address"
                placeholder="12 Groove Ave"
              />
            )}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city?.message}>
              {(p) => (
                <Input {...p} {...register("city")} autoComplete="address-level2" placeholder="London" />
              )}
            </Field>
            <Field label="Postal code" error={errors.postalCode?.message}>
              {(p) => (
                <Input
                  {...p}
                  {...register("postalCode")}
                  autoComplete="postal-code"
                  placeholder="EC1A 1BB"
                />
              )}
            </Field>
          </div>
          <Field label="Country" error={errors.country?.message}>
            {(p) => (
              <Input
                {...p}
                {...register("country")}
                autoComplete="country-name"
                placeholder="United Kingdom"
              />
            )}
          </Field>

          <p className="font-sans text-xs text-muted">
            Payment is mocked — placing the order won't charge anything, and no
            records ship.
          </p>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary
            subtotal={cart.totalAmount}
            itemCount={itemCount}
            action={
              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                className="w-full"
                isLoading={placeOrder.isPending}
              >
                Place order
              </Button>
            }
          />
        </div>
      </div>
    </Container>
  );
}
