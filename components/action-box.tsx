import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

type ActionBoxProps = ComponentPropsWithoutRef<"div"> & {
  title?: string;
};

export default function ActionBox({
  children,
  className,
  title,
}: ActionBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-black p-4",
        className
      )}
    >
      {title && (
        <h2 className="bg-white px-2 h-10 flex items-center justify-center rounded-md uppercase font-medium">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}
