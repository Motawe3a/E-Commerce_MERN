import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Disc3 } from "lucide-react";
import { checkout } from "@/api/orders";
import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/i18n/useI18n";
import { normalizeError } from "@/lib/apiError";
import { queryKeys } from "@/lib/queryClient";
import { Container } from "@/components/layout/Container";
import { Button, buttonClass } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { CartSummary } from "@/components/cart/CartSummary";

interface CheckoutForm {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const { data: cart, isLoading, itemCount } = useCart();

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(2, t("checkout.needName")),
        street: z.string().min(3, t("checkout.needStreet")),
        city: z.string().min(2, t("checkout.needCity")),
        postalCode: z.string().min(3, t("checkout.needPostal")),
        country: z.string().min(2, t("checkout.needCountry")),
      }),
    [t],
  );

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
      toast.success(t("checkout.placed"));
      navigate(`/orders/${order._id}`, { replace: true });
    },
    onError: (error) => toast.error(normalizeError(error, t)),
  });

  if (isLoading) {
    return (
      <Container className="py-14">
        <PageLoader label={t("checkout.loading")} />
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-14">
        <EmptyState
          icon={Disc3}
          title={t("checkout.emptyTitle")}
          description={t("checkout.emptyBody")}
          action={
            <Link to="/" className={buttonClass()}>
              {t("cart.browse")}
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
        <ArrowLeft className="size-4 rtl:-scale-x-100" />
        {t("checkout.back")}
      </Link>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">{t("checkout.title")}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 border-2 border-ink bg-card p-6"
        >
          <h2 className="text-2xl">{t("checkout.shipTo")}</h2>

          <Field label={t("checkout.fullName")} error={errors.fullName?.message}>
            {(p) => (
              <Input {...p} {...register("fullName")} autoComplete="name" placeholder="Ada Lovelace" />
            )}
          </Field>
          <Field label={t("checkout.street")} error={errors.street?.message}>
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
            <Field label={t("checkout.city")} error={errors.city?.message}>
              {(p) => (
                <Input {...p} {...register("city")} autoComplete="address-level2" placeholder="London" />
              )}
            </Field>
            <Field label={t("checkout.postal")} error={errors.postalCode?.message}>
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
          <Field label={t("checkout.country")} error={errors.country?.message}>
            {(p) => (
              <Input
                {...p}
                {...register("country")}
                autoComplete="country-name"
                placeholder="United Kingdom"
              />
            )}
          </Field>

          <p className="font-sans text-xs text-muted">{t("checkout.mockNote")}</p>
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
                {t("checkout.place")}
              </Button>
            }
          />
        </div>
      </div>
    </Container>
  );
}
