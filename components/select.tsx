import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectBaseProps = {
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  setSelected: (value: string) => void;
  triggerClassName?: string;
  contentClassName?: string;
};

export default function SelectBase({
  options,
  label,
  placeholder,
  setSelected,
  triggerClassName,
  contentClassName,
}: SelectBaseProps) {
  return (
    <Select onValueChange={(value) => setSelected(value)}>
      <SelectTrigger className={cn("min-w-[120px] w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder ?? "Select"} />
      </SelectTrigger>

      <SelectContent className={cn("min-w-[120px]", contentClassName)}>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option.label} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
