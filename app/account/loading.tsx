import LoadingIndicator from "@/components/LoadingIndicator";

export default function Loading() {
  return (
    <div className="flex min-h-100 items-center justify-center text-primary-300">
      <LoadingIndicator label="Loading your account..." />
    </div>
  );
}
