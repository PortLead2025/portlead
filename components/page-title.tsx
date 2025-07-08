import { cn } from "@/lib/helpers";
import { ComponentPropsWithoutRef } from "react";

type PageTitleProps = ComponentPropsWithoutRef<"h1"> & {};

export default function PageTitle({ className, children }: PageTitleProps) {
  return (
    <h1 className={cn("text-xl font-medium uppercase text-center", className)}>
      {children}
    </h1>
  );
}
