import Spinner from "@/components/Spinner";

type LoadingIndicatorProps = {
  label: string;
  className?: string;
};

export default function LoadingIndicator({
  label,
  className = "",
}: LoadingIndicatorProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center gap-2 text-sm ${className}`}
    >
      <Spinner size="sm" decorative />
      <span>{label}</span>
    </span>
  );
}
