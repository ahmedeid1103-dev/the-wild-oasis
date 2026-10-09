import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest area",
};

export default function Page() {
  return (
    <div>
      <h1 className="mb-5 text-4xl font-medium text-accent-400">Guest area</h1>

      <p className="text-primary-200 text-lg">
        This is your guest area. Sign in to view your reservations and manage
        your account.
      </p>
    </div>
  );
}
