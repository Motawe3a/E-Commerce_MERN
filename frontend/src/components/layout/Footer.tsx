import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-ink">
      <Container className="flex flex-col gap-1 py-8 font-sans text-xs text-muted sm:flex-row sm:justify-between">
        <p>Dead Wax — new, used &amp; rare vinyl.</p>
        <p>Payments are mocked. No records are actually shipped.</p>
      </Container>
    </footer>
  );
}
