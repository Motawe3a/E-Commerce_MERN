import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className={buttonClass({ className: "mt-6" })}>
        Back home
      </Link>
    </Container>
  );
}
