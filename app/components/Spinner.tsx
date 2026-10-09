type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClass = {
    sm: "size-4",
    md: "size-5",
    lg: "size-7",
  }[size];

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${sizeClass} ${className}`}
    />
  );
}
