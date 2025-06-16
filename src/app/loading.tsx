import Spinner from "@/src/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Spinner size={48} />
    </div>
  );
} 