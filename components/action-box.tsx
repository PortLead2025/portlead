import { cn } from "@/lib/helpers";
import { ComponentPropsWithoutRef } from "react";

type ActionBoxProps = ComponentPropsWithoutRef<"div"> & {
  title: string;
};

export default function ActionBox({
  children,
  className,
  title,
}: ActionBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 w-1/2 rounded-xl border border-black p-4",
        className
      )}
    >
      <h2 className="border border-black px-2 h-10 flex items-center justify-center rounded-md uppercase font-medium">
        {title}
      </h2>

      {children}
    </div>
  );
}
