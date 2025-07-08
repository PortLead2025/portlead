import { cn } from "@/lib/helpers";
import { ComponentPropsWithoutRef } from "react";

type DividerProps = ComponentPropsWithoutRef<"hr"> & {};

export default function Divider({ className }: DividerProps) {
  return (
    <hr
      className={cn(
        "w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent",
        className
      )}
    />
  );
}
