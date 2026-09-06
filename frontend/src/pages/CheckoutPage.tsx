import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Lock, ShoppingCart } from "lucide-react";
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
      toast.success("Order placed!");
      navigate(`/orders/${order._id}`, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error)),
  });

  if (isLoading) {
    return (
      <Container className="py-10">
        <PageLoader label="Loading checkout…" />
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-10">
        <EmptyState
          icon={ShoppingCart}
          title="Nothing to check out"
          description="Your cart is empty."
          action={
            <Link to="/products" className={buttonClass()}>
              Browse products
            </Link>
          }
        />
      </Container>
    );
  }

  const onSubmit = (values: CheckoutForm) => {
    const address = `${values.fullName}, ${values.street}, ${values.city} ${values.postalCode}, ${values.country}`;
    placeOrder.mutate(address);
  };

  return (
    <Container className="py-10">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-ink">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-line bg-white p-6"
        >
          <h2 className="text-sm font-semibold text-ink">Shipping address</h2>

          <Field label="Full name" error={errors.fullName?.message}>
            {(props) => (
              <Input
                {...props}
                {...register("fullName")}
                autoComplete="name"
                placeholder="Ada Lovelace"
              />
            )}
          </Field>

          <Field label="Street address" error={errors.street?.message}>
            {(props) => (
              <Input
                {...props}
                {...register("street")}
                autoComplete="street-address"
                placeholder="12 Analytical Ave"
              />
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city?.message}>
              {(props) => (
                <Input
                  {...props}
                  {...register("city")}
                  autoComplete="address-level2"
                  placeholder="London"
                />
              )}
            </Field>
            <Field label="Postal code" error={errors.postalCode?.message}>
              {(props) => (
                <Input
                  {...props}
                  {...register("postalCode")}
                  autoComplete="postal-code"
                  placeholder="EC1A 1BB"
                />
              )}
            </Field>
          </div>

          <Field label="Country" error={errors.country?.message}>
            {(props) => (
              <Input
                {...props}
                {...register("country")}
                autoComplete="country-name"
                placeholder="United Kingdom"
              />
            )}
          </Field>

          <p className="flex items-center gap-1.5 pt-2 text-xs text-muted">
            <Lock className="size-3.5" />
            Payment is mocked — placing the order won't charge anything.
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
                className="w-full"
                size="lg"
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
