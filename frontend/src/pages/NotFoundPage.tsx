import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <Container className="py-24">
      <p className="font-display text-[clamp(5rem,20vw,12rem)] leading-none text-spot">
        404
      </p>
      <h1 className="mt-2 text-3xl">You've hit a locked groove</h1>
      <p className="mt-3 max-w-sm font-sans text-sm text-muted">
        This page loops nowhere. The record you're after isn't in the racks.
      </p>
      <Link to="/" className={buttonClass({ className: "mt-8" })}>
        Back to the catalog
      </Link>
    </Container>
  );
}
