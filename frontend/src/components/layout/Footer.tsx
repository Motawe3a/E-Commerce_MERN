import { useI18n } from "@/i18n/useI18n";
import { Container } from "./Container";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t-2 border-ink">
      <Container className="flex flex-col gap-1 py-8 font-sans text-xs text-muted sm:flex-row sm:justify-between">
        <p>{t("footer.line1")}</p>
        <p>{t("footer.line2")}</p>
      </Container>
    </footer>
  );
}
