import { cn } from "@/lib/utils";

type InvoiceItemProps = {
  label: string;
  value: string | number | null;
  className?: string;
};

export default function InvoiceItem({
  label,
  value,
  className,
}: InvoiceItemProps) {
  if (!value) return null;

  return (
    <p className={cn("flex justify-between font-medium", className)}>
      {label} <span className="font-normal">{value}</span>
    </p>
  );
}
