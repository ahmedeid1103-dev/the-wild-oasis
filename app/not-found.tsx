import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <p className="ui-eyebrow mb-4">404 · Off the beaten path</p>
      <h1 className="ui-page-title mb-4">This page couldn&apos;t be found</h1>
      <p className="mb-8 leading-7 text-content-muted">
        The link may have changed. Find your way back to a mountain stay.
      </p>
      <Link href="/cabins" className="ui-button ui-button--primary">Explore our cabins</Link>
    </section>
  );
}
