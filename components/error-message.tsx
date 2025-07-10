import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  message?: string | null;
  className?: string;
};

export default function ErrorMessage({
  message,
  className,
}: ErrorMessageProps) {
  return (
    <p
      className={cn(
        "h-[12px] leading-[1] px-1 text-[12px] text-red-400",
        className
      )}
    >
      {message && message}
    </p>
  );
}
