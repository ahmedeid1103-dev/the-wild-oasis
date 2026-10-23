import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-primary-400">
        <Spinner decorative />
        <span>Loading cabins...</span>
      </div>
    </div>
  );
}
