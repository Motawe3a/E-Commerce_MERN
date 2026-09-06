import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/useI18n";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <Container className="py-24">
      <p className="font-display text-[clamp(5rem,20vw,12rem)] leading-none text-spot" dir="ltr">
        {t("notFound.code")}
      </p>
      <h1 className="mt-2 text-3xl">{t("notFound.title")}</h1>
      <p className="mt-3 max-w-sm font-sans text-sm text-muted">{t("notFound.body")}</p>
      <Link to="/" className={buttonClass({ className: "mt-8" })}>
        {t("notFound.back")}
      </Link>
    </Container>
  );
}
