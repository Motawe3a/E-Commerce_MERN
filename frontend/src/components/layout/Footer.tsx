import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <Container className="flex flex-col items-center justify-between gap-2 py-8 text-sm text-muted sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Storefront. Demo project.</p>
        <p>Payments are mocked — no real charges.</p>
      </Container>
    </footer>
  );
}
